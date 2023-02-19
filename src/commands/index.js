const fs = require("fs");
const _async = require("async")
const zippyshare = require("../lib/zippyshare");
const { ProgressBar } = require("ascii-progress")
const { DownloaderHelper } = require("node-downloader-helper")
const { getDownloadLinks, getEpisode, search } = require("../lib/scrape.js");


let configDir = __dirname + "/../config/samehadaku.json"
let config = JSON.parse(fs.readFileSync(configDir, "utf-8"))


const start = async () => {
    let titles = await search((await Question({
        type: "input",
        name: "title",
        message: "Cari anime apa?"
    })).title, config)

    let EpMessage = `Ditemukan ${titles.found} judul, pilih salah satu:`
    let { qTitle } = await Question({
        type: "list",
        name: "qTitle",
        message: EpMessage,
        choices: titles.result.map((el) => el.title)
    })

    let selectedEpisode = titles.result.find((el) => el.title == qTitle)
    let epsiode = await getEpisode(selectedEpisode.href, config)

    // select episode
    let { qEpisode } = await Question({
        type: "checkbox",
        name: "qEpisode",
        message: "Pilih episode yang ingin di download",
        choices: epsiode.episode.map((el) => el.number)
    })

    let selectedEpisodeList = epsiode.episode.filter((el) => qEpisode.includes(el.number))
    let downloadLinks = await getQualityInfo(selectedEpisodeList)

    let selectedQnF = await Question({
        type: "list",
        name: "qQuality",
        message: "Pilih kualitas dan format",
        choices: Object.keys(downloadLinks).map((el) => el.split("_").join(" "))
    })

    let { savePath } = await Question({
        type: "input",
        name: "savePath",
        message: "Dimana file akan disimpan?",
        default: __dirname + "\\download"
    })

    if (!fs.existsSync(savePath)) {
        fs.mkdirSync(savePath)
    }

    let zippyLinks = downloadLinks[selectedQnF.qQuality.split(" ").join("_")]

    _async.mapLimit(zippyLinks, 5, (el, cb) => {
        startDownload(el, savePath).catch(e => {
            console.log(e)
        }).finally(cb())
    })

}


async function getQualityInfo(episode) {
    let qualityInfo = {}


    for (const element in episode) {
        let result = await getDownloadLinks(episode[element].link, config)
        result.forEach(el => {
            let quality = el.quality;
            let type = el.type;

            let key = Object.keys(quality);
            let value = Object.values(quality);

            key.forEach((el, i) => {
                let qualityKey = (type + el).trim();
                if (!qualityInfo[qualityKey]) {
                    qualityInfo[qualityKey] = [];
                }

                qualityInfo[qualityKey].push({
                    title: episode[element].number,
                    link: value[i].Zippyshare
                });
            });

        });
    }

    return qualityInfo

}

function startDownload(el, savePath) {
    return new Promise(async (resolve, reject) => {
        let bar = new ProgressBar({
            schema: ":title [:bar] :percent/:size :elapseds :speed",
            completed: "█",
            blank: " ",
            total: 100,
            width: 60,
        });

        try {

            bar.tick(0, {
                title: "Downloading episode " + el.title,
                size: "0MB",
                speed: "0Kbps"
            })

            let { title, link } = await zippyshare(el.link)

            if (!title || !link) {
                bar.setSchema("File hilang di server untuk episode :title")
                bar.completed = true
                reject("File hilang di server untuk episode " + el.title);
            }

            title = title.length > 25 ? title.substring(0, 22) + "..." : title + " ".repeat(25 - title.length);

            let dl = new DownloaderHelper(link, savePath, {
                fileName: title,
                override: true
            })

            dl.on("end", () => {
                bar.update(100)
                resolve("File berhasil di download");
            })

            dl.on("error", (error) => {
                bar.setSchema("ERROR :title")
                reject("Ada masalah untuk episode " + el.title + " karena: " + error.message);
            })

            let lastProgress = 0
            dl.on("progress.throttled", (stats) => {

                let sizeinMB = (stats.total / 1000000).toFixed(2)
                let speedinKB = (stats.speed / 1000).toFixed(2)

                bar.tick(stats.progress - lastProgress, {
                    title: title,
                    size: sizeinMB + "MB",
                    speed: speedinKB + "Kbps"
                })
                lastProgress = stats.progress;
            })

            dl.start()
        } catch (error) {
            bar.setSchema("ERROR :title")
            bar.completed = true
            reject("Ada masalah untuk episode " + el.title + " karena: " + error);
        }
    })

}

function Question(opts) {
    return new Promise((resolve, reject) => {
        import("inquirer").then((module) => {
            let inquirer = module.default
            inquirer
                .prompt(
                    opts = Array.isArray(opts) ? opts : [opts]
                )
                .then((answers) => {
                    resolve(answers)
                }).catch((e) => {
                    reject(e)
                })
        })
    })
}

module.exports = start