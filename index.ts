#!/usr/bin/env node

import * as fs from "fs"
import * as cp from "child_process"
import * as async from "async"

import * as p from "./package.json"

import { CV } from "./CV"
import { render } from "./Renderer"
import "./DocxRenderer"
import "./HtmlRenderer"
import "./PdfRenderer"

export class Program {
	private defaultCommand = "html"
	constructor(private commands: string[]) {
		this.commands = this.commands.slice(2)
		if (this.commands.length == 0) {
			this.commands.push(this.defaultCommand)
			this.commands.push(".")
		}
	}
	private open(path: string | undefined): CV | undefined {
		return path ? JSON.parse(fs.readFileSync(path, "utf-8")) as CV : undefined
	}

	private async runHelper(command: string | undefined, commands: string[]): Promise<void> {
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
					if (command) {
					const path = this.commands.shift()
						if (path) {
							const cv = JSON.parse(fs.readFileSync(path, "utf-8")) as CV
							const stream = fs.createWriteStream(path.replace(/\.json$/, "." + command))
							const style = this.commands.shift()
							async.parallel([
								_ => {
									stream.on("close", () => process.exit(0))
									render(command, cv, stream, style)
								},
							], error => {
								if (error)
									console.log("error: " + error)
							})
						}
					}
				break
		}
		if (command)
			this.defaultCommand = command
	}
	async run(): Promise<void> {
		let command: string | undefined
		while (command = this.commands.shift())
			await this.runHelper(command, this.commands)
	}
	getVersion(): string {
		return p.version
	}
}
new Program(process.argv).run()
