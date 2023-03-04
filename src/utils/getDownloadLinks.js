const get = require("../lib/fetch");
const cheerio = require("cheerio")

function getDownloadPage(url) {
	return new Promise(async (resolve, reject) => {
        try {
            if (!url) {
                reject("URL is required");
            }
            
            let origin = new URL(url).origin
            let res = await get(url);
            let $ = cheerio.load(res)

            let downloadPage = $(".bixbox.hentry > div.entry-content > center > a.singledl").attr("href");
            
            resolve(origin + downloadPage);
        } catch (error) {
            reject(error)
        }
	});
}

function getDownloadLinks(url) {
    return new Promise(async (resolve, reject) => {
        try {
            if (!url) {
                reject("URL is required");
            }

            url = await getDownloadPage(url);

            let res = await get(url);
            let $ = cheerio.load(res);

            const tableRow = $("#content > div > div.postbody > div > div.page > table > tbody > tr");
            let downloadLinks = [];
            tableRow.each((i, el) => {
              let quality = $(el).find("td:nth-child(1)").text().trim();
              let links = $(el).find("td:nth-child(2) > a");
            
              let providers = {};
              links.each((i, link) => {
                let linkText = $(link).text().trim();
                let linkHref = $(link).attr("data-href");
                if (providers[linkText]) {
                  providers[linkText].push(linkHref);
                } else {
                  providers[linkText] = [linkHref];
                }
              });
            
              let providersArray = [];
              for (let [provider, links] of Object.entries(providers)) {
                providersArray.push({
                  provider: provider,
                  links: links
                });
              }
            
              downloadLinks.push({
                quality: quality,
                download_links: providersArray
              });
            });
            
            resolve(downloadLinks);
        } catch (error) {
            reject(error);
        }
    })
}

getDownloadLinks('https://154.26.137.28/tomo-chan-wa-onnanoko-episode-9/').then(res => console.log(res)).catch(err => console.log(err))