function cleanUrl(original_url) {
  const url = original_url;
  const parsedUrl = new URL(url);
  let pathWithoutTrailingSlash = parsedUrl.pathname;
  if (pathWithoutTrailingSlash.endsWith("/")) {
    pathWithoutTrailingSlash = pathWithoutTrailingSlash.slice(0, -1);
  }
  const urlWithoutProtocolAndParams =
    parsedUrl.hostname + pathWithoutTrailingSlash;
  console.log(urlWithoutProtocolAndParams);
  return urlWithoutProtocolAndParams;
}

export default cleanUrl;
