/// <reference path="CV" />

module CVRender {
	export class Renderer {
		private renderEmployment(data: Employment): string {
			return `
			<article class="employment">
				<h2>${data.title}, <em>${data.company}</em></h2>
				<p class="time">${data.start} - ${data.end}</p>​
				<p>${data.description}</p>
			</article>`}
		private renderEducation(data: Education): string {
			return `
			<article class="education">
				<h2>${data.name}, <em>${data.school}</em></h2>
				<p class="time">${data.start} - ${data.end}</p>​
				<p>${data.description}</p>
			</article>`}
		private renderProject(data: Project): string {
			return `
			<article class="project">
				<h2>${data.name}</h2>
				<p class="time">${data.start} - ${data.end}</p>​
				<p class="roles">${data.roles.join(", ")}</p>
				<p>${data.description}</p>
				<ul class="competences">
					${data.competences.map(c => `<li>${c}</li>`).join("")}
				</ul>
			</article>`}
		render(data: CV): string { return `
<!DOCTYPE HTML>
<html>
	<head>
		<meta charset="UTF-8">
		<title>${data.name}</title>
		<meta name="classification" content=""/>
		<meta name="date" content="${data.date}"/>
		<meta name="email" content="${data.email}"/>
		<meta name="phone" content="${data.phone}"/>
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
				<p class="description">${data.description}</p>
			</article>
			<article>
				<h2>Competences</h2>
				<ul class="competences">
					${data.competences.map(c => `<li>${c}</li>`).join("")}
				</ul>
			</article>
		</section>
		<section id="employments">
			<h1>Employments</h1>
			${data.employments.map(this.renderEmployment).join("")}
		</section>
		<section id="educations">
			<h1>Educations</h1>
			${data.educations.map(this.renderEducation).join("")}
		</section>
		<section id="projects">
			<h1>Projects</h1>
			${data.projects.map(this.renderProject).join("")}
		</section>
	</body>
</html>
` }
	}
}