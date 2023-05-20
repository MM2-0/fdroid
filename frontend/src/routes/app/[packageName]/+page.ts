import { error } from '@sveltejs/kit'
import type { FDroidIndexV2 } from '../../../lib/fdroid/fdroid-index'
import type { PageLoadEvent } from './$types'

export async function load({ fetch, params }: PageLoadEvent) {
	const data = (await (await fetch('/data')).json()) as FDroidIndexV2
	if (!params.packageName) throw error(400)
	const app = data.packages[params.packageName]
	if (!app) throw error(404)

	const versions = Object.values(app.versions).sort(
		(a, b) => b.manifest.versionCode - a.manifest.versionCode,
	)
	return {
		repo: {
			icon: data.repo.address + data.repo.icon['en-US'].name,
			name: data.repo.name['en-US'],
		},
		app: {
			label: app.metadata.name['en-US'],
			icon: data.repo.address + app.metadata.icon['en-US'].name,
			summary: app.metadata.summary['en-US'],
			description: app.metadata.description?.['en-US'],
			versions: versions.map((version) => ({
				name: version.manifest.versionName,
				releaseDate: version.added,
				download: data.repo.address + version.file.name,
			})),
		},
	}
}
