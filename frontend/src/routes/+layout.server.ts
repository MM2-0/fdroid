import type { ServerLoadEvent } from '@sveltejs/kit'
import type { FDroidIndexV2 } from '../lib/fdroid/fdroid-index'

export async function load({ fetch }: ServerLoadEvent) {
	const data = (await (await fetch('/data')).json()) as FDroidIndexV2
	return {
		repo: {
			name: data.repo.name['en-US'],
		},
	}
}
