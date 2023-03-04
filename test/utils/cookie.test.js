const {getCookie, encodeCookie} = require("../../src/utils/cookie.js");

describe("getCookie", () => {
  let originalFetch;

  beforeEach(() => {
    originalFetch = global.fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  test("returns an array of three encoded cookies", async () => {
    global.fetch = jest.fn(() => Promise.resolve({ text: () => Promise.resolve("loc=SG") }));

    const cookies = await getCookie();

    expect(cookies).toHaveLength(3);
    expect(cookies[0]).toMatch(/^_as_ipin_tz=.+;expires=.+;path=\/;SameSite=Strict$/);
    expect(cookies[1]).toMatch(/^_as_ipin_lc=.+;expires=.+;path=\/;SameSite=Strict$/);
    expect(cookies[2]).toMatch(/^_as_ipin_ct=.+;expires=.+;path=\/;SameSite=Strict$/);
  });

  test("throws an error if fetch fails", async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error("Failed to fetch")));

    await expect(getCookie()).rejects.toThrow("Failed to fetch");
  });

  test("encodeCookie returns a correctly formatted cookie string", () => {
    const cname = "_as_ipin_tz";
    const cvalue = "Asia/Singapore";
    const exdays = 1;

    const cookie = encodeCookie(cname, cvalue, exdays);

    expect(cookie).toMatch(/^_as_ipin_tz=Asia\/Singapore;expires=.+;path=\/;SameSite=Strict$/);
  });
});
