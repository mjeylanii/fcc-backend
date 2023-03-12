const Url = require("./models/urls");

function cleanUrl(url) {
  try {
    const parsedUrl = new URL(url);
    let pathWithoutTrailingSlash = parsedUrl.pathname;
    if (pathWithoutTrailingSlash.endsWith("/")) {
      pathWithoutTrailingSlash = pathWithoutTrailingSlash.slice(0, -1);
    }
    const urlWithoutProtocolAndParams =
      parsedUrl.hostname + pathWithoutTrailingSlash;
    console.log(urlWithoutProtocolAndParams);
    return urlWithoutProtocolAndParams;
  } catch (error) {
    console.error(error);
    return "";
  }
}

async function createUrl(url) {
  try {
    const count = await Url.countDocuments({});
    const newUrl = new Url({ original_url: url, short_url: count + 1 });
    const result = await newUrl.save();
    return result;
  } catch (error) {
    console.log(error);
  }
}
async function findUrl(url, shortUrl) {
  if (url == "" && shortUrl !== "") {
    let result = await Url.find({ short_url: shortUrl }).then((res) => {
      return res;
    });
    return result;
  } else {
    let result = await Url.find({ original_url: url }).then((res) => {
      return res;
    });
    return result;
  }
}

module.exports = {
  cleanUrl,
  createUrl,
  findUrl,
};
