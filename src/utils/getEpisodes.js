const get = require("../lib/fetch.js");
const cheerio = require("cheerio");

/**
 * 
 * @param {String<URL>} url a url to a page with episodes
 * @param {Array<Number>} range an array of episodde numbers
 * @returns Promoise<Array> an array of objects with episode data
 */
function getEpisodes(url, range) {
    return new Promise(async (resolve, reject) => {
        try {
            if (!url) {
                reject("URL is required");
            }

            if (!range || !Array.isArray(range)) {
                reject("No episode given")
            }

            const result = await get(url);
            const $ = cheerio.load(result);

            let episodes = [];
            let episoodeList = $(".bixbox.hentry > div.entry-content.serial-info > ul > li");
            episoodeList.each((i, el) => {
                el = $(el);
                let episode = {
                    episode: parseInt((el.find("a").text()).match(/\d+/)[0]),
                    url: el.find("a").attr("href")
                }

                if (range.includes(parseInt(episode.episode))) {
                    episodes.push(episode);
                }
            })

            resolve(episodes);
        } catch (error) {
            reject(error);
        }
    })
}

module.exports = getEpisodes