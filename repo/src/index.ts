import { config as dotenv } from 'dotenv'
import type { ReleaseSource } from './sources/release-source'
import { GhActionSource } from './sources/gh-action-source.js'
import { Release } from './release'
import fs from 'fs/promises'
import YAML from 'yaml'
import type { AppMeta } from './app-meta'
import { GhReleaseSource } from './sources/gh-release-source.js'

dotenv()
main()

async function main() {
	await generateConfig()
	const sources = await getSources()

	for (const source of sources) {
		console.log('Getting releases from source', source)
		const releases = await getReleasesFromSource(source)
		for (const release of releases) {
			await writeMeta(release)
		}
	}
}

async function generateConfig() {
	const repoConfig = YAML.parse(
		await fs.readFile('../config/repository.yml', 'utf-8'),
	)
	const fdroidConfig = YAML.parse(
		await fs.readFile('tmp/config.yml', 'utf-8'),
	)
	fdroidConfig.repo_url = repoConfig.url
	fdroidConfig.repo_description = repoConfig.description
	fdroidConfig.repo_name = repoConfig.name

	try {
		await fs.stat('../config/icon.png')
		await fs.copyFile('../config/icon.png', 'tmp/icon.png')
		fdroidConfig.repo_icon = 'icon.png'
	} catch (e: any) {}

	await fs.writeFile('tmp/config.yml', YAML.stringify(fdroidConfig))
}

async function getSources(): Promise<ReleaseSource[]> {
	const sources: ReleaseSource[] = []

	const configContents = await fs.readdir('../config')
	for (const pkg of configContents) {
		try {
			const config = YAML.parse(
				await fs.readFile(`../config/${pkg}/source.yml`, 'utf-8'),
			)
			if (config.type === 'gh_actions') {
				sources.push(
					new GhActionSource({
						owner: config.owner,
						repo: config.repo,
						action: config.action,
					}),
				)
			} else if (config.type === 'gh_release') {
				sources.push(
					new GhReleaseSource({
						owner: config.owner,
						repo: config.repo,
					}),
				)
			}
		} catch (e: any) {
			continue
		}
	}
	return sources
}

async function getReleasesFromSource(
	source: ReleaseSource,
): Promise<Release[]> {
	const releases = await source.getReleases()
	return releases
}

async function writeMeta(release: Release) {
	try {
		await fs.stat(`tmp/metadata/${release.packageName}`)
	} catch (e: any) {
		await initPackageMeta(release.packageName)
	}
	if (release.changelog) {
		await fs.writeFile(
			`tmp/metadata/${release.packageName}/en-US/changelogs/${release.versionCode}.txt`,
			release.changelog,
		)
	}
}

async function initPackageMeta(packageName: string) {
	await fs.mkdir(`tmp/metadata/${packageName}`)
	await fs.mkdir(`tmp/metadata/${packageName}/en-US`)
	await fs.mkdir(`tmp/metadata/${packageName}/en-US/images`)
	await fs.mkdir(`tmp/metadata/${packageName}/en-US/changelogs`)
	const meta = YAML.parse(
		await fs.readFile(`../config/${packageName}/metadata.yml`, 'utf-8'),
	) as AppMeta

	if (meta.name) {
		await fs.writeFile(
			`tmp/metadata/${packageName}/en-US/title.txt`,
			meta.name,
		)
	}

	if (meta.summary) {
		await fs.writeFile(
			`tmp/metadata/${packageName}/en-US/summary.txt`,
			meta.summary,
		)
	}
	if (meta.description) {
		await fs.writeFile(
			`tmp/metadata/${packageName}/en-US/description.txt`,
			meta.description,
		)
	}

	try {
		await fs.stat(`../config/${packageName}/icon.png`)
		await fs.copyFile(
			`../config/${packageName}/icon.png`,
			`tmp/metadata/${packageName}/en-US/images/icon.png`,
		)
	} catch (e: any) {
		console.warn('Missing app icon for package', packageName)
	}

	await fs.writeFile(
		`tmp/metadata/${packageName}.yml`,
		YAML.stringify({
			License: meta.license,
			AuthorName: meta.author?.name,
			AuthorEmail: meta.author?.email,
			WebSite: meta.website,
			IssueTracker: meta.issues,
			SourceCode: meta.source,
			Translation: meta.translation,
			Donate: meta.donate,
			Categories: meta.categories,
			AntiFeatures: meta.antiFeatures,
		}),
	)
}
