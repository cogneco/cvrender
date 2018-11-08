import { Employment } from "./Employment"
import { Education } from "./Education"
import { Project } from "./Project"
import { CV } from "./CV"
import * as officegen from "officegen"
import * as fs from "fs"

export class DocxRenderer {
	backend
	style = {
		header: { font_size: 18, bold: true },
		h1: { font_size: 16, bold: false },
		h2: { font_size: 14, bold: false },
		h3: { font_size: 12, bold: false },
		h6: { font_size: 11, bold: true }
	}
	private renderEmployment(data: Employment): void {
		if (data) {
			var p = this.backend.createP()
			p.addText(data.title + ", ", this.style.h2)
			p.addText(data.company, { ...this.style.h2, italic: true })
			p.addHorizontalLine()
			this.backend.createP().addText(`${data.start} - ${data.end}`)
			data.description.split("\n\n").forEach(paragraph =>
				this.backend.createP().addText(paragraph)
			)
		}
	}
	private renderEducation(data: Education): void {
		if (data) {
			var p = this.backend.createP()
			p.addText(data.name + " ", this.style.h2)
			p.addText(data.school, { ...this.style.h2, italic: true })
			p.addHorizontalLine()
			this.backend.createP().addText(`${data.start} - ${data.end}`)
			data.description.split("\n\n").forEach(paragraph => {
				this.backend.createP().addText(paragraph)
			})
		}
	}
	private renderProject(data: Project): void {
		if (data) {
			var p = this.backend.createP()
			p.addText(data.name, this.style.h2)
			if (data.customer) {
				p.addText(", ", this.style.h2)
				p.addText(data.customer, { ...this.style.h2, italic: true })
			}
			p.addHorizontalLine()
			this.backend.createP().addText(`${data.start} - ${data.end}`)
			data.description.split("\n\n").forEach(paragraph => {
				this.backend.createP().addText(paragraph)
			})
			var p = this.backend.createP()
			p.addText("Role: ", this.style.h6)
			p.addText(data.roles.join(", "))
			var p = this.backend.createP()
			p.addText("Competence: ", this.style.h6)
			p.addText(data.competences.join(", "))
		}
	}
	render(data: CV, output: fs.WriteStream): void {
		this.backend = officegen({
			'type': 'docx',
			'subject': data.name
		})
		var p = this.backend.createP()
		if (data.photo) {
			p.addImage(data.photo, { cy: 100, cx: 81.3 })
			p.addLineBreak()
		}
		p.addText(data.name, this.style.header)
		var p = this.backend.createP()
		p.addText("Profile", this.style.h1)
		p.addHorizontalLine()
		data.description.split("\n\n").forEach(paragraph => {
			this.backend.createP().addText(paragraph)
		})
		var p = this.backend.createP()
		p.addText("Competences", this.style.h2)
		p.addHorizontalLine()
		data.competences.forEach(c => {
			this.backend.createListOfDots().addText(c)
		})
		if (data.employments) {
			var p = this.backend.createP()
			p.addText("Employments", this.style.h1)
			p.addHorizontalLine()
			data.employments.forEach(this.renderEmployment.bind(this))
		}
		if (data.projects) {
			var p = this.backend.createP()
			p.addText("Projects", this.style.h1)
			p.addHorizontalLine()
			data.projects.forEach(this.renderProject.bind(this))
		}
		if (data.education) {
			var p = this.backend.createP()
			p.addText("Education", this.style.h1)
			p.addHorizontalLine()
			data.education.forEach(this.renderEducation.bind(this))
		}
		this.backend.generate(output)
	}
}
