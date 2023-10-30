const {JSDOM} = require('jsdom')

function normalizeUrl(url) {
    let path;
    const urlObject = new URL(url)
    if (url[url.length - 1] === '/') {
        return (urlObject.hostname + urlObject.pathname).slice(0, -1)
    } else {
        return urlObject.hostname + urlObject.pathname
    }
}

function getURLsFromHTML(htmlBody, baseURL) {
    const links = []
    const dom = new JSDOM(htmlBody)
    const anchorTags = dom.window.document.querySelectorAll('a')
    for (const link of anchorTags) {
        if (link.href[0] === '/') {
            const madeAbsolute = baseURL + link.href
            links.push(madeAbsolute)
        } else if (link.href.slice(0, 4) === 'http') {
            links.push(link.href)
        }
    }
    return links
}

module.exports = {
    normalizeUrl,
    getURLsFromHTML,
}
