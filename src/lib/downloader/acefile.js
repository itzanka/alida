function acefile(acefileUrl, retryCount = 5) {
	return new Promise(async (resolve, reject) => {
		try {
			let response = await fetch(acefileUrl);
			if (!response.ok) {
				throw new Error("Failed to fetch URL. Possible invalid URL or connection issue.");
			}
			let responseBody = await response.text();
			let code = responseBody.split("eval(")[1].split("{}))")[0] + "{})";
			let evalFn = "(" + code.split("return p}(").join("saveToTemp(p)}(") + ")";
			
			let tempData = "";
			function saveToTemp(data) {
				tempData = data;
			}
			let _ = await eval(evalFn);
			
			
			let DUAR = JSON.parse(tempData.split("var DUAR=")[1].split(";var checksum")[0]);
			
			if (!DUAR.AceFile[0]) reject("Failed to parse download links from AceFile");
			
			let part1 = tempData.split('check=atob("')[1].split('")')[0];
			let part2 = DUAR.AceFile[0].code;
			let part3 = tempData.split(')+atob("')[1].split('");$.')[0];
			let driveUrl = "";
			[part1, part2, part3].forEach((part) => {
				let decodedPart = Buffer.from(part, "base64").toString("utf-8");
				driveUrl += decodedPart;
			});

			
			let driveIdResponse = await fetch(driveUrl);
			let driveIdResponseBody = await driveIdResponse.text();
			let driveId = JSON.parse(driveIdResponseBody).id;
			if (!driveId) {
				throw new Error(
					"Failed to get drive ID. Possible invalid URL or download limit reached."
				);
			}
			
			
			let finalUrl = "https://drive.google.com/uc?export=download&id=" + driveId;
			resolve(finalUrl);
		} catch (error) {
			if (retryCount <= 0) {
				reject(error);
			} else {
				acefile(acefileUrl, retryCount - 1)
					.then(resolve)
					.catch(reject);
			}
		}
	});
}

module.exports = acefile