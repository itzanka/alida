const { getDownloadLinks, getEpisode, search } = require("./lib/scrape.js");
const { zippyshare } = require("./lib/zippyshare.js");
const start = require("./commands/index.js");
const fs = require("fs");


if (require.main === module) {
    start();
} else {
    module.exports = {
        getDownloadLinks,
        getEpisode,
        search,
        zippyshare
    }
}