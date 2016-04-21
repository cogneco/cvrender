/// <reference path="./tsd.d.ts" />
import { CV } from "./CV"
import { Renderer } from "./Renderer"

import * as fs from "fs"
import * as cp from "child_process"

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
				case "html":
					var cv = this.open(commands.shift())
					var output = new Renderer().render(cv)
					console.log(output)
					break
				case "version": console.log("cvrender " + this.getVersion()); break
				case "help": console.log("help")
					console.log("cvrender html [cv.json]")
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
