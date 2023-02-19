# Cuman bahan gabut (●'◡'●)

## Instalasi
<!-- dropdown -->
<details>
<summary>Gak ngerti programing</summary>
<br>

<h3><strong>Gpp Sini ku ajarin</strong></h3>
di windows kalian tinggal Download <a target='blank' href="https://git-scm.com/downloads">Git</a target="blank" href="https://nodejs.org/"> sama <a>Nodejs</a> dulu, setelah itu install aja

<br>
<p>
kalo kalian di hp, bisa pake termux, caranya ya download dulu termux di <a target='blank' href="https://f-droid.org/packages/com.termux/">F-droid</a>
</p>
<p>nah setelah donwload tinggal install git sama nodejs, caranya bisa buka termux terus jalanin perintah dibawah ini nih:</p>
<pre>
~$ apt update
~$ apt upgrade
~$ apt install nodejs git -y
</pre>

nah kalo udah kalian bisa lanjut ke bawah deh

</details>
<br>

**1. Clone repo ini**
```
$ git clone https://github.com/itzanka/alida
$ cd alida
```

**2. install package nya**
```bash
$ npm install
```
kamu juga bisa pake pnpm atau yarn kalo mau

**3. Jalanin deh script nya**

```bash
$ npm start
```

## Kalo jadi module gimana?
bisa aja tapi kamu harus install lewat github kek gini:
```bash
$ npm install git+https://github.com/itzanka/alida.git
```
kalo udah tinggal gunakan aja. well gak ada dokumentasi yang jelas soal package ini karena ini cuman project gabut.
<br>
tapi kamu bakalan dapat setidaknya 4 function yaitu
```
search              = buat nyari anime
getEpisode          = buat dapatin episode nya
getDownloadLinks    = nah ini buat parse download link dari getEpisode
zippyshare          = buat ekstrak link donwload dari zippyshare
```
penggunaan nya bisa kek gini

```js
const {
        config,
        getDownloadLinks,
        getEpisode,
        search,
        zippyshare,
} = require("alida");

....
let searchResult    = await search("black clover", config);
let episode         = await getEpisode(searchResult, config);
let downloadLink    = await getDownloadLinks(episode.link, config);
let linkZippyshare  = await zippyshare(downloadLink[0].link);
....

```

itu config apaan njirt kok dipake di semua tempat kenapa gak dijadiin 1 aja biar simple. 
<br>
niatnya gitu le, tapi namanya kan pikir ku siapa tau bisa buat nanti kan (〜￣▽￣)〜 biar mudah kostuminasi nya.
<br>
itu config isinya apa aja dan dimana aja yang bakalan di scrape le. contoh e kek gini le

```json
{
    "url": "https://example.lee/",
    "search": {
        "path": "?s={query}",
        "separator": "+",
        "list": "main#main.site-main.relat > article.animpost",
        "title": "div.animposx > a > .data > .title > h2",
        "link": " div.animposx > a"
    },
    "detail": {
        "info": {
            "title": "#infoarea > div > div.infoanime.widget_senction > div.infox > h1",
            "synopsis": "#infoarea > div > div.infoanime.widget_senction > div.infox > div.desc > div",
            "genre": "#infoarea > div > div.infoanime.widget_senction > div.infox > div.genre-info",
            "detail": {
                "list": "#infoarea > div > div.anim-senct > div.right-senc.widget_senction > div > div > div > span",
                "name": "span > b",
                "value": ""
            }
        },
        "episode": {
            "list": "div.lstepsiode.listeps > ul.scrolling > li",
            "link": "div.epsleft > span > a",
            "number": "div.epsright > span > a"
        }
    },
    "downloadLinks": {
        "list": ".download-eps#downloadb",
        "fileType": "p > b",
        "link": {
            "list": "ul > li",
            "quality": "strong",
            "link": "span"
        }
    }
}
```
tambahin sendiri situs mu le

# Kontribusi?
monggo, arepe mbok jupuk kode ne yo monggo bebas, karo aku lozz le