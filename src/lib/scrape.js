const cheerio = require("cheerio")

 function search(name, config) {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await fetch(config.url + config.search.path.replace("{query}", name.split(" ").join(config.search.separator)))
            let $ = cheerio.load(await data.text())
            let list = $(config.search.list)
            let result = []
            list.each((i, el) => {
                result.push({
                    title: $(el).find(config.search.title).text(),
                    href: $(el).find(config.search.link).attr("href")
                })
            })
            resolve({
                found: result.length,
                result
            })
        } catch (error) {
            reject(error)
        }
    })
}

 async function getEpisode(url, config) {
    let data = await (await fetch(url)).text()
    let $ = cheerio.load(data)
    let episodeList = $(config.detail.episode.list)
    let detailList = $(config.detail.info.detail.list)
    let episode = []
    let detail = {}
    episodeList.each((i, el) => {
        episode.push({
            number: $(el).find(config.detail.episode.number).text(),
            link: $(el).find(config.detail.episode.link).attr("href")
        })
    })
    detailList.each((i, el) => {
        let name = $(el).find(config.detail.info.detail.name).text()
        let value = config.detail.info.detail.value ? $(el).find(config.detail.info.detail.value).text() : $(el).text()
        value.includes(name) ? value = value.replace(name, "") : value = value
        detail[name.replace(":", "")] = value.trim()
    })
    return ({
        title: $(config.detail.info.title).text(),
        synopsis: $(config.detail.info.synopsis).text(),
        genre: $(config.detail.info.genre).text(),
        detail,
        episode
    })
}

 async function getDownloadLinks(url, config) {
    let data = await (await fetch(url)).text()

    let $ = cheerio.load(data)
    let list = $(config.downloadLinks.list)

    let result = []
    list.each((i, el) => {
        const fileType = $(el).find(config.downloadLinks.fileType).text()
        const linkList = $(el).find(config.downloadLinks.link.list)

        let quality = {}
        linkList.each((i, el) => {
            let links = {}

            let Quality = $(el).find(config.downloadLinks.link.quality).text().split(" ").join("_")
            let link = $(el).find(config.downloadLinks.link.link)

            // check if quality == MP4HD or FULLHD
            if (Quality.includes("MP4HD")) {
                Quality = "720p"
            } else if (Quality.includes("FULLHD")) {
                Quality = "1080p"
            }
            
            link.each((i, el) => {
                links[$(el).find("a").text()] = $(el).find("a").attr("href")
            })

            quality["_" + Quality] = links

        })

        result.push({
            type: fileType,
            quality
        })
    })

    return result
}

module.exports = { search, getEpisode, getDownloadLinks }