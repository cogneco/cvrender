
import { CV } from "./CV"
import { render } from "./Renderer"

import * as fs from "fs"
import * as async from "async"

import "./DocxRenderer"
import "./HtmlRenderer"
import "./PdfRenderer"

module CVRender {
	export class Program {
		private defaultCommand = "html"
		constructor(private commands: string[]) {
			this.commands = this.commands.slice(2)
			if (this.commands.length == 0) {
				this.commands.push(this.defaultCommand)
				this.commands.push(".")
			}
		}
		private runHelper(command: string, commands: string[]) {
			switch (command) {
				case "version": console.log("cvrender " + this.getVersion()); break
				case "help":
					console.log("cvrender html [cv.json] <style.css>")
					console.log("cvrender pdf [cv.json] <style.css>")
					console.log("cvrender docx [cv.json] <style.json>")
					console.log("cvrender version")
					console.log("cvrender help")
					break
				default:
					var path = this.commands.shift()
					var cv = JSON.parse(fs.readFileSync(path, "utf-8")) as CV
					var stream = fs.createWriteStream(path.replace(/\.json$/, "." + command))
					var style = this.commands.shift()
					async.parallel([
						_ => {
							stream.on("close", () => process.exit(0))
							render(command, cv, stream, style)
						}
					], error => {
						if (error)
							console.log('error: ' + error)
					})
				}
		}
		run() {
			var command: string
			while (command = this.commands.shift())
				this.runHelper(command, this.commands)
		}
		getVersion(): string {
			return "0.1"
		}
	}
}
new CVRender.Program(process.argv).run()
