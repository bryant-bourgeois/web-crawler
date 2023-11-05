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

async function crawlPage(baseURL) {
    async function getPage(URL) {
        return await fetch(URL)
    }

    let response;
    try {
        response = await getPage(baseURL)
    } catch (e) {
        console.error(e.message)
    }
    const contentType = (response.headers.get('content-type'))

    if (response.status >= 400 && response.status <= 599) {
        console.log(`Error in request: HTTP response code ${response.status}, ${response.statusText}`)
    } else if (!contentType.includes('text/html')) {
        console.log(`Error in request. Response data is not of ContentType: text/html`)
    }
    let htmlPage;
    const parsed = await response.text()
        .then(data => htmlPage = data)
    console.log(htmlPage)
}

module.exports = {
    normalizeUrl,
    getURLsFromHTML,
    crawlPage,
}
