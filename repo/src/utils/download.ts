import fs from 'fs'

export async function downloadBinary(body: ReadableStream, targetPath: string) {
	const reader = body.getReader()
	const writer = fs.createWriteStream(targetPath)
	while (true) {
		const { done, value } = await reader.read()
		if (done) break
		writer.write(value)
	}
	return new Promise((resolve) => writer.close(resolve))
}
