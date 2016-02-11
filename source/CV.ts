/// <reference path="Employment" />
/// <reference path="Education" />
/// <reference path="Project" />

module CVRender {
	export interface CV {
		style: string
		updated: string
		name: string
		email: string
		phone: string
		photo?: string
		description: string
		competences: string[]
		employments: Employment[],
		educations: Education[],
		projects: Project[]
	}
}