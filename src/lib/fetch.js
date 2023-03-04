const { getCookie } = require("../utils/cookie");

function get(url) {
  return new Promise(async (resolve, reject) => {
      try {
        let cookie = await getCookie();
        let response = await fetch(url, {
            headers: {
                cookie: cookie.join(";"),
            },

        }).then((res) => res.text());
          
        resolve(response);
    } catch (error) {
        reject(error);
    }
  });
}

module.exports = get;