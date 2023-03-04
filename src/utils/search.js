const get = require("../lib/fetch,js");
const config = require("../config/default.json")


function search(title) {
	return new Promise(async (resolve, reject) => {
		try {
			let _title = title.trim().split(" ").join("+");

			let searchResult = await get(config.endpoint + "/wp-json/wp/v2/posts?search=" + _title)

			resolve(JSON.parse(searchResult));
		} catch (error) {
			reject(error);
		}
	});
}

module.exports = search;
