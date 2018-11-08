import { Employment } from "./Employment"
import { Education } from "./Education"
import { Project } from "./Project"
import { CV } from "./CV"
import { addRenderer, Renderer } from "./Renderer"
import * as fs from "fs"
import * as inline from "inline-html"

export class HtmlRenderer extends Renderer {
	constructor() { super() }
	private renderEmployment(data: Employment): string {
		return data ? `
		<article class="employment">
			<h2>${data.title}, <em>${data.company}</em></h2>
			<p class="time">${data.start} - ${data.end}</p>​
			<p>${data.description.replace("\n\n","</p><p>")}</p>
		</article>` : ""}
	private renderEducation(data: Education): string {
		return data ? `
		<article class="education">
			<h2>${data.name}, <em>${data.school}</em></h2>
			<p class="time">${data.start} - ${data.end}</p>​
			<p>${data.description.replace("\n\n","</p><p>")}</p>
		</article>` : ""}
	private renderProject(data: Project): string {
		return data ? `
		<article class="project">
		<h2>${data.name}${data.customer ? `, <em>${data.customer}</em>` : ""}</h2>
			<p class="time">${data.start} - ${data.end}</p>​
			<p>${data.description.replace("\n\n","</p><p>")}</p>
			<dl>
				<dt>Role</dt>
				${data.roles.map(c => `<dd>${c}</dd>`).join("")}
				<dt>Competence</dt>
				${data.competences.map(c => `<dd>${c}</dd>`).join("")}
			</dl>
		</article>` : ""}
	renderString(data: CV, style?: string): string { return `
<!DOCTYPE HTML>
<html>
<head>
	<meta charset="UTF-8">
	<title>${data.name}</title>
	<meta name="subject" content="${data.name}"/>
	${data.email ? `<meta name="email" content="${data.email}"/>` : ""}
	${data.phone ? `<meta name="phone" content="${data.phone}"/>` : ""}
	<meta name="date" content="${data.updated || new Date().toDateString()}"/>
	<meta name="classification" content=""/>
	<meta name="generator" content="https://github.com/cogneco/cvrenderer"/>
	${style ? `<link rel="stylesheet" type="text/css" href="${style}">`	: ""}
</head>
<body>
	<header>
		${data.photo ? `<img src="${data.photo}" />` : "" }
		<h1>${data.name}</h1>
	</header>
	<section id="profile">
		<h1>Profile</h1>
		<article>
			<p>${data.description.replace("\n\n","</p><p>")}</p>
		</article>
		<article>
			<h2>Competences</h2>
			<ul class="competences">
				${data.competences.map(c => `<li>${c}</li>`).join("")}
			</ul>
		</article>
	</section>
	${data.projects ?
	`<section id="projects">
		<h1>Projects</h1>
		${data.projects.map(this.renderProject).join("")}
	</section>` : ""}
	${data.employments ?
	`<section id="employments">
		<h1>Employments</h1>
		${data.employments.map(this.renderEmployment).join("")}
	</section>` : ""}
	${data.education ?
	`<section id="educations">
		<h1>Education</h1>
		${data.education.map(this.renderEducation).join("")}
	</section>` : ""}
</body>
</html>
` }
	async render(data: CV, output: fs.WriteStream, style?: string): Promise<boolean> {
		return inline.html(this.renderString(data, style)).then(d => output.write(d))
	}
}
addRenderer("html", (data: CV, output: fs.WriteStream, style: string) => new HtmlRenderer().render(data, output, style))

