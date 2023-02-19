const { getDownloadLinks, getEpisode, search } = require("./lib/scrape.js");
const { zippyshare } = require("./lib/zippyshare.js");
const start = require("./commands/index.js");
const fs = require("fs");


if (require.main === module) {
    start();
} else {
    let config = JSON.parse(fs.readFileSync("./config/samehadaku.json", "utf-8"))
    module.exports = {
        getDownloadLinks,
        getEpisode,
        search,
        zippyshare,
        config
    }
}