import nodeApk, { type Manifest } from 'node-apk'

const { Apk } = nodeApk

export async function getApkInfo(filePath: string): Promise<Manifest> {
	const apk = new Apk(filePath)
	const manifestInfo = await apk.getManifestInfo()

	return manifestInfo
}
