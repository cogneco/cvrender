import { CV } from "./CV"
import * as fs from "fs"

export abstract class Renderer {
	constructor() { }
	abstract render(data: CV, result: fs.WriteStream, style?: string): Promise<boolean>
}
type renderer = (data: CV, output: fs.WriteStream, style?: string) => Promise<boolean>
var renderers: { [type: string]: renderer } = {}
export function addRenderer(type: string, render: renderer) {
	renderers[type] = render
}
export async function render(type: string, data: CV, output: fs.WriteStream, style?: string) : Promise<boolean> {
	const render = renderers[type]
	let result = !!render
	if (result)
		result = await render(data, output, style)
	return result
}