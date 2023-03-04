const get = require("../../src/lib/fetch");

describe("Testing fetch function", () => {
	test("Return a HTML of requested site", async () => {
		let result = await get("https://google.com");
		expect(result).toContain("<!doctype html>");
	});


});
