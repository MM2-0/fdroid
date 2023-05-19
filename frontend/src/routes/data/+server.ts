import { json } from '@sveltejs/kit'
import fs from 'fs/promises'
import path from 'path'

export const prerender = true

export async function GET() {
	const data = await fs.readFile(
		path.resolve(process.cwd(), '../repo/tmp/repo/index-v2.json'),
		'utf-8',
	)

	return json(JSON.parse(data))
}
