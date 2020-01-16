import { Program } from "./"

describe("command line", () => {
	it("version", async () => {
		const program = new Program(["version"])
		expect(program.getVersion().slice(0, 4)).toEqual("0.1.")
	})
})
