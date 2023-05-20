import { Octokit } from 'octokit'
import { Release } from '../release'
import { ReleaseSource } from './release-source'
import { downloadBinary } from '../utils/download.js'
import { getApkInfo } from '../utils/apk.js'
import fs from 'fs/promises'

export interface GhReleaseSourceOptions {
	owner: string
	repo: string
}

export class GhReleaseSource implements ReleaseSource {
	private client: Octokit
	private token: string
	constructor(private options: GhReleaseSourceOptions) {
		const token = process.env.GITHUB_TOKEN
		if (!token) throw new Error('GITHUB_TOKEN not set')
		this.client = new Octokit({
			auth: token,
		})
		this.token = token
	}

	async getReleases(): Promise<Release[]> {
		const result: Release[] = []
		const releases = await this.client.rest.repos.listReleases({
			owner: this.options.owner,
			repo: this.options.repo,
			per_page: 5,
		})

		for (const release of releases.data) {
			const assets = release.assets
			if (assets.length === 0) continue
			const apk = assets.find((asset) => asset.name.endsWith('.apk'))
			if (!apk) continue
			const downloadBody = (await fetch(apk.browser_download_url)).body
			if (!downloadBody) continue
			await downloadBinary(downloadBody, 'tmp/repo/downloading.apk')
			const apkInfo = await getApkInfo('tmp/repo/downloading.apk')

			await fs.rename(
				`tmp/repo/downloading.apk`,
				`tmp/repo/${apkInfo.package}-${apkInfo.versionName}.apk`,
			)

			await fs.utimes(
				`tmp/repo/${apkInfo.package}-${apkInfo.versionName}.apk`,
				new Date(release.created_at),
				new Date(release.created_at),
			)

			result.push({
				version: apkInfo.versionName,
				versionCode: apkInfo.versionCode,
				changelog: release.body ?? '',
				packageName: apkInfo.package,
				releaseDate: new Date(release.created_at),
			})
		}

		return result
	}
}
