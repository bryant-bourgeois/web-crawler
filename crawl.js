const { JSDOM } = require('jsdom')
function normalizeUrl(url) {
    let path;
    const urlObject = new URL(url)
    if(url[url.length -1] === '/'){
        return (urlObject.hostname + urlObject.pathname).slice(0,-1)
    } else {
        return urlObject.hostname + urlObject.pathname
    }
}

function getURLsFromHTML(htmlBody, baseURL){
   return 'foo'
}

module.exports = {
  normalizeUrl,
  getURLsFromHTML,
}
