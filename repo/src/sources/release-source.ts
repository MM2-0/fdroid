import type { Release } from "../release"

export interface ReleaseSource {
	getReleases(): Promise<Release[]>
}
