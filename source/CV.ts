import { Employment } from "./Employment"
import { Education } from "./Education"
import { Project } from "./Project"

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
	education: Education[],
	projects: Project[]
}
