import { Employment } from "./Employment"
import { Education } from "./Education"
import { Project } from "./Project"
import { CV } from "./CV"

export class Renderer {
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
			<h2>${data.name}</h2>
			<p class="time">${data.start} - ${data.end}</p>​
			<p>${data.description.replace("\n\n","</p><p>")}</p>
			<dl>
				<dt>Role</dt>
				${data.roles.map(c => `<dd>${c}</dd>`).join("")}
				<dt>Competence</dt>
				${data.competences.map(c => `<dd>${c}</dd>`).join("")}
			</dl>
		</article>` : ""}
	render(data: CV): string { return `
<!DOCTYPE HTML>
<html>
<head>
	<meta charset="UTF-8">
	<title>${data.name}</title>
	<meta name="subject" content="${data.name}"/>
	<meta name="email" content="${data.email}"/>
	<meta name="phone" content="${data.phone}"/>
	<meta name="date" content="${data.updated}"/>
	<meta name="classification" content=""/>
	<meta name="generator" content="https://github.com/cogneco/cvrenderer"/>
	<link rel="stylesheet" type="text/css" href="${data.style}">
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
	${data.employments ?
	`<section id="employments">
		<h1>Employments</h1>
		${data.employments.map(this.renderEmployment).join("")}
	</section>` : ""}
	${data.projects ?
	`<section id="projects">
		<h1>Projects</h1>
		${data.projects.map(this.renderProject).join("")}
	</section>` : ""}
	${data.education ?
	`<section id="educations">
		<h1>Education</h1>
		${data.education.map(this.renderEducation).join("")}
	</section>` : ""}
</body>
</html>
` }
}
