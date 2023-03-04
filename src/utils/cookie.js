async function getCookie() {
	try {
		const response = await fetch("https://aghanim.xyz/cdn-cgi/trace");
		const resp = await response.text();
		let trace = {};
		let lines = resp.split(/\r?\n/);
		let keyValue;
		let cookie = [];

		lines.forEach(function (line) {
			keyValue = line.split("=");
			trace[keyValue[0]] = decodeURIComponent(keyValue[1] || "").trim();
		});

		cookie.push(
			encodeCookie("_as_ipin_tz", Intl.DateTimeFormat().resolvedOptions().timeZone, 1)
		);
		cookie.push(encodeCookie("_as_ipin_lc", Intl.DateTimeFormat().resolvedOptions().locale, 1));
		cookie.push(encodeCookie("_as_ipin_ct", trace["loc"], 1));

		return cookie;
	} catch (error) {
		throw error;
	}
}

function encodeCookie(cname, cvalue, exdays) {
	let d = new Date();
	d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
	let expires = "expires=" + d.toUTCString();
	return cname + "=" + cvalue + ";" + expires + ";path=/;SameSite=Strict";
}

module.exports = {
	getCookie,
	encodeCookie,
};
