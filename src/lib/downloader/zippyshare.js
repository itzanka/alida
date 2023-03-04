async function zippyshare(url) {
    return new Promise(async (resolve, reject) => {
        try {
            if (!url.includes(".zippyshare.com/", 13)) {
                reject("Ivalid url")
            }

            let res = await (await fetch(url, {
                headers: {
                    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36 Edg/98.0.1108.62"
                }
            })).text()

            let raws = res
                .split(`document.getElementById('dlbutton').href = `)[1]
                .split(`if (document.getElementById('fimage')) {`)[0];
            let title =
                res.split("<title>Zippyshare.com - ")[1].split("</title>")[0] || "No Info";
            let size =
                res
                    .split('<font style="line-height:18px;')[2]
                    .split(">")[1]
                    .split("</")[0] || "No Info";

            let part1 = raws.split('"')[1];
            let part2 = eval(raws.split("(")[1].split(")")[0]);
            let part3 = raws.split('+ "')[1].split('"')[0];

            let link = url.split("ippyshare.com")[0] + "ippyshare.com" + part1 + part2.toString() + part3;

            resolve({ title, size, link });
        }
        catch (error) {
           if((error.message).includes("split")){
               reject("File maybe expired in zippyshare")
           } else {
                reject(error.message)
           }
        }
    })
}

module.exports = zippyshare