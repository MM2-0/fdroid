import fs from 'fs'

export async function downloadBinary(body: ReadableStream, targetPath: string) {
	console.log('Downloading', targetPath)
	const reader = body.getReader()
	const writer = fs.createWriteStream(targetPath)
	while (true) {
		const { done, value } = await reader.read()
		if (done) break
		writer.write(value)
	}
	console.log('Done.')
	return new Promise((resolve) => writer.close(resolve))
}
