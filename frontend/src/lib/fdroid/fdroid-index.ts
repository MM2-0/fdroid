export interface FDroidIndexV2 {
	repo: {
		name: {
			[key: string]: string
		}
		description: {
			[key: string]: string
		}
		icon: {
			[key: string]: FileInfo
		}
		address: string
		timestamp: string
	}
	packages: {
		[key: string]: {
			metadata: {
				added: number
				categories: string[]
				issueTracker: string
				lastUpdated: number
				license: string
				sourceCode: string
				translation: string
				webSite: string
				authorName: string
				name: {
					[key: string]: string
				}
				summary: {
					[key: string]: string
				}
				description: {
					[key: string]: string
				}
				donate: string[]
				icon: {
					[key: string]: FileInfo
				}
				preferredSigner: string
			}
			versions: {
				[key: string]: {
					added: number
					file: FileInfo
					manifest: {
						versionName: string
						versionCode: number
						usesSdk: {
							minSdkVersion: number
							targetSdkVersion: number
						}
						signer: {
							sha256: string[]
						}
						usesPermission: {
							name: string
						}[]
					}
					antiFeatures: string[]
				}
			}
		}
	}
}

interface FileInfo {
	name: string
	sha256: string
	size: number
}
