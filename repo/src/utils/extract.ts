import yauzl from 'yauzl'
import fs from 'fs'

export async function extractZip(
	filePath: string,
	targetPath: string,
): Promise<void> {
	return new Promise((resolve, reject) => {
		yauzl.open(filePath, { lazyEntries: true }, (err, zipfile) => {
			if (err) reject(err)
			zipfile.readEntry()
			zipfile.on('entry', (entry) => {
				zipfile.openReadStream(entry, (err, readStream) => {
					readStream.on('end', () => {
						zipfile.close()
						resolve()
					})
					readStream.pipe(fs.createWriteStream(targetPath))
				})
			})
		})
	})
}
