import { CV } from "./CV"
import * as fs from "fs"

export abstract class Renderer {
	constructor() { }
	abstract render(data: CV, result: fs.WriteStream, style?: string): Promise<boolean>
}
type renderer = (data: CV, output: fs.WriteStream, style?: string) => Promise<boolean>
const renderers: { [type: string]: renderer } = {}
export function addRenderer(type: string, r: renderer) {
	renderers[type] = r
}
export async function render(type: string, data: CV, output: fs.WriteStream, style?: string): Promise<boolean> {
	const r = renderers[type]
	let result = !!r
	if (result)
		result = await r(data, output, style)
	return result
}
