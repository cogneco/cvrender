import { CV } from "./CV"
import { addRenderer } from "./Renderer"
import { HtmlRenderer } from "./HtmlRenderer";

import * as inline from "inline-html"
import * as fs from "fs"
import * as cp from "child_process"
import * as async from "async"

export class PdfRenderer extends HtmlRenderer {
	constructor() { super() }
	async render(data: CV, output: fs.WriteStream, style?: string): Promise<boolean> {
		return output.write(cp.execFileSync("prince", ["--javascript", "-", "-o", "-"], { input: this.renderString(data, style), cwd: style ? style.replace(/\/[a-z,A-Z,-,_,\.]+$/, "") : "" }))
	}
}
addRenderer("pdf", (data: CV, output: fs.WriteStream, style: string) => new PdfRenderer().render(data, output, style))

