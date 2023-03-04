const getEpisodes = require("../../src/utils/getEpisodes");

describe("Test a get episode function", () => {
    // beforeAll(() => {
    //     setTimeout(10000)
    // })

	test("getEpisodes should reject with 'URL is required' when url parameter is undefined", async () => {
		await expect(getEpisodes()).rejects.toMatch("URL is required");
	});

	test("getEpisodes should reject with 'No episode given' when range parameter is undefined", async () => {
		await expect(
			getEpisodes("https://154.26.137.28/anime/tomo-chan-wa-onnanoko/")
		).rejects.toMatch("No episode given");
	});

	test("getEpisodes should reject with 'No episode given' when range parameter is not an array", async () => {
		await expect(
			getEpisodes("https://154.26.137.28/anime/tomo-chan-wa-onnanoko/", "invalid range")
		).rejects.toMatch("No episode given");
	});

	test("getEpisodes should resolve with an empty array when no episodes match the range", async () => {
		const episodes = await getEpisodes(
			"https://154.26.137.28/anime/tomo-chan-wa-onnanoko/",
			[100, 101, 102]
		);
		expect(Array.isArray(episodes)).toBe(true);
		expect(episodes).toHaveLength(0);
	});

	test("getEpisodes should resolve with an array of episode objects that match the range", async () => {
		const episodes = await getEpisodes(
			"https://154.26.137.28/anime/tomo-chan-wa-onnanoko/",
			[1, 2, 3]
		);
		expect(Array.isArray(episodes)).toBe(true);
		expect(episodes).toHaveLength(3);
		episodes.forEach((episode) => {
			expect(typeof episode).toBe("object");
			expect(episode).toHaveProperty("episode");
			expect(episode).toHaveProperty("url");
			expect(typeof episode.episode).toBe("number");
			expect(typeof episode.url).toBe("string");
		});
    });
    
    afterAll(() => {
		return new Promise((resolve) => setTimeout(() => resolve(), 500));
	});
});
