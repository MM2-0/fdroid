import type { Release } from "../release.js"

export interface ReleaseSource {
	getReleases(): Promise<Release[]>
}
