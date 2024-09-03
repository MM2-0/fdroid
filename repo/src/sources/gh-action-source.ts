import { Octokit } from 'octokit'
import type { Release } from '../release'
import type { ReleaseSource } from './release-source'
import { downloadBinary } from '../utils/download.js'
import { extractZip } from '../utils/extract.js'
import { getApkInfo } from '../utils/apk.js'
import fs from 'fs/promises'

export interface GhActionSourceOptions {
	owner: string
	repo: string
	action: string
}

export class GhActionSource implements ReleaseSource {
	private client: Octokit
	private token: string
	constructor(private options: GhActionSourceOptions) {
		const token = process.env.GITHUB_TOKEN
		if (!token) throw new Error('GITHUB_TOKEN not set')
		this.client = new Octokit({
			auth: token,
		})
		this.token = token
	}

	async getReleases(): Promise<Release[]> {
		const runs = await this.client.rest.actions.listWorkflowRuns({
			owner: this.options.owner,
			repo: this.options.repo,
			workflow_id: this.options.action,
		})
		const validRuns = runs.data.workflow_runs.filter(
			(run) => run.conclusion === 'success',
		)

		const selectedRuns = validRuns.slice(0, 5)

		if (selectedRuns.length === 0) return []

		const latestRun = selectedRuns[0]
		const firstRun =
			selectedRuns.length < validRuns.length
				? validRuns[selectedRuns.length]
				: selectedRuns[selectedRuns.length - 1]

		const commits =
			validRuns.length >= 2
				? (
						await this.client.rest.repos.compareCommitsWithBasehead(
							{
								owner: this.options.owner,
								repo: this.options.repo,
								basehead: `${firstRun.head_sha}...${latestRun.head_sha}`,
							},
						)
				  ).data.commits
				: []

		const artifacts = await Promise.all(
			selectedRuns.map((run) =>
				this.client.rest.actions.listWorkflowRunArtifacts({
					owner: this.options.owner,
					repo: this.options.repo,
					run_id: run.id,
				}),
			),
		)

		const validArtifacts = artifacts.filter(
			(it) => it.data.artifacts.length > 0,
		)

		const releases: Release[] = []

		for (let i = 0; i < validArtifacts.length; i++) {
			const artifact = validArtifacts[i].data.artifacts[0]
			const lastCommitSha = artifact.workflow_run?.head_sha
			const lastCommitIndex = commits.findIndex(
				(commit) => commit.sha === lastCommitSha,
			)
			const firstCommitSha =
				validArtifacts[i + 1]?.data.artifacts[0].workflow_run?.head_sha

			let firstCommitIndex = commits.findIndex(
				(commit) => commit.sha === firstCommitSha,
			)
			if (firstCommitIndex === -1) firstCommitIndex = commits.length
			const diff = commits.slice(
				firstCommitIndex + 1,
				lastCommitIndex + 1,
			)

			const version = artifact.workflow_run?.head_sha?.substring(0, 7)

			if (!version) continue

			const artifactDownload = await fetch(
				artifact.archive_download_url,
				{
					headers: {
						Authorization: `token ${this.token}`,
					},
				},
			)
			const downloadBody = artifactDownload.body
			if (!downloadBody) continue

			await downloadBinary(downloadBody, `tmp/repo/downloading.zip`)

			await extractZip(
				`tmp/repo/downloading.zip`,
				`tmp/repo/downloading.apk`,
			)

			await fs.rm(`tmp/repo/downloading.zip`)

			const apkInfo = await getApkInfo(`tmp/repo/downloading.apk`)

			await fs.rename(
				`tmp/repo/downloading.apk`,
				`tmp/repo/${apkInfo.package}-${version}.apk`,
			)

			await fs.utimes(
				`tmp/repo/${apkInfo.package}-${version}.apk`,
				new Date(artifact.created_at ?? 0),
				new Date(artifact.created_at ?? 0),
			)

			if (
				releases.some(
					(it) =>
						it.versionCode === apkInfo.versionCode &&
						it.packageName === apkInfo.package,
				)
			) {
				console.warn(
					`Duplicate version code ${apkInfo.versionCode} for package ${apkInfo.package}`,
				)
				await fs.rm(`tmp/repo/${apkInfo.package}-${version}.apk`)
			}

			releases.push({
				changelog:
					diff
						.map((commit) => {
							const msg = commit.commit.message
							const lines = msg.split('\n')
							return `* (${commit.sha.substring(0, 7)}) ${
								lines[0]
							}\n`
						})
						.join('') || 'No changes',
				version,
				versionCode: apkInfo.versionCode,
				packageName: apkInfo.package,
				releaseDate: new Date(artifact.created_at ?? 0),
			})
		}

		return releases
	}
}
