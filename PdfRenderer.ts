import { CV } from "./CV"
import { addRenderer } from "./Renderer"
import { HtmlRenderer } from "./HtmlRenderer"

import * as fs from "fs"
import * as cp from "child_process"

export class PdfRenderer extends HtmlRenderer {
	constructor() { super() }
	async render(data: CV, output: fs.WriteStream, style?: string): Promise<boolean> {
		const input = this.renderString(data, style)
		const d = cp.execFileSync("prince", ["--javascript", "-", "-o", "-"], { input })
		return output.write(d.join())
	}
}
addRenderer("pdf", (data: CV, output: fs.WriteStream, style: string) => new PdfRenderer().render(data, output, style))
