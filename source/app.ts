
import { CV } from "./CV"
import { HtmlRenderer } from "./HtmlRenderer"
import { DocxRenderer } from "./DocxRenderer"

import * as fs from "fs"
import * as cp from "child_process"
import * as async from "async"
import * as co from "co"
import * as inline from "inline-html"

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
		private open(path: string): CV {
			return <CV> JSON.parse(fs.readFileSync(path, "utf-8"))
		}
		private save(path: string, content: string) {
			fs.writeFile(path, content)
		}
		private runHelper(command: string, commands: string[]) {
			switch (command) {
				case "docx":
					var path = this.commands.shift()
					var cv = this.open(path)
					var stream = fs.createWriteStream(path.replace(/\.json$/, ".docx"))
					async.parallel([
						done => {
							stream.on("close", () => process.exit(0))
							new DocxRenderer().render(cv, stream)
						}
					], error => {
						if (error) {
							console.log('error: ' + error)
						}
					})
					break
				case "html":
					var path = this.commands.shift()
					var cv = this.open(path)
					var output = new HtmlRenderer().render(cv)
					inline.html(output).then(output => {
						fs.writeFileSync(path.replace(/\.json$/, ".html"), output)
						process.exit(0)
					})
					break
				case "pdf":
					var path = this.commands.shift()
					var cv = this.open(path)
					var output = new HtmlRenderer().render(cv)
					fs.writeFileSync(path.replace(/\.json$/, ".pdf"), cp.execFileSync("prince", ["--javascript", "-", "-o", "-"], { input: output, cwd: path.replace(/\/[a-z,A-Z,-,_,\.]+$/, "") }))
					break
				case "version": console.log("cvrender " + this.getVersion()); break
				case "help":
					console.log("cvrender html [cv.json]")
					console.log("cvrender pdf [cv.json]")
					console.log("cvrender version")
					console.log("cvrender help")
					break
				default:
					commands.push(command)
					command = undefined
					this.runHelper(this.defaultCommand, commands)
					break
			}
			if (command)
				this.defaultCommand = command
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
