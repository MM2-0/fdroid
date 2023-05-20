import type { PageLoadEvent } from './$types'
import type { FDroidIndexV2 } from '../lib/fdroid/fdroid-index'
import { PUBLIC_FDROID_FINGERPRINT } from '$env/static/public'

export async function load({ fetch, parent }: PageLoadEvent) {
	const data = (await (await fetch('/data')).json()) as FDroidIndexV2
	return {
		repo: {
			description: data.repo.description['en-US'],
			url: data.repo.address,
			fingerprint: PUBLIC_FDROID_FINGERPRINT,
			icon: data.repo.address + data.repo.icon['en-US'].name,
			qrCode: data.repo.address + '/index.png',
			name: data.repo.name['en-US'],
		},
		apps: Object.entries(data.packages).map(([id, app]) => ({
			packageName: id,
			label: app.metadata.name['en-US'],
			icon: data.repo.address + app.metadata.icon['en-US'].name,
			summary: app.metadata.summary['en-US'],
			author: app.metadata.authorName,
		})),
	}
}
