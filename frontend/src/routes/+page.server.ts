import type { ServerLoadEvent } from '@sveltejs/kit'
import type { FDroidIndexV2 } from '../lib/fdroid/fdroid-index'
import { FDROID_FINGERPRINT } from '$env/static/private'

export async function load({ fetch }: ServerLoadEvent) {
	const data = (await (await fetch('/data')).json()) as FDroidIndexV2
	return {
		repo: {
			name: data.repo.name['en-US'],
			description: data.repo.description['en-US'],
			url: data.repo.address,
			fingerprint: FDROID_FINGERPRINT,
			icon: data.repo.address + data.repo.icon['en-US'].name,
			qrCode: data.repo.address + '/index.png',
		},
	}
}
