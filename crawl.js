const {JSDOM} = require('jsdom')

function normalizeURL(url) {
    let path;
    const urlObject = new URL(url)
    if (url[url.length - 1] === '/') {
        return (urlObject.hostname + urlObject.pathname).slice(0, -1)
    } else {
        return urlObject.hostname + urlObject.pathname
    }
}

function getURLsFromHTML(htmlBody, baseURL) {
    let links = []
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
    for (let i = 0; i < links.length; i++) {
        if (!links[i].startsWith(baseURL)) {
            delete links[i]
        }
    }
    links = links.filter(n => n.includes('#') ? null : n)
    links = links.filter(n => n.includes('.xml') ? null : n)
    links = links.filter(n => n.includes('.json') ? null : n)
    links = links.filter(n => n.includes('.jpeg') ? null : n)
    links = links.filter(n => n.includes('.png') ? null : n)
    links = links.filter(n => n.includes('.webp') ? null : n)
    return links.filter(n => n)
}

async function crawlPage(baseURL, currentURL, pages) {
    const currentUrlObj = new URL(currentURL)
    const baseUrlObj = new URL(baseURL)
    if (currentUrlObj.hostname !== baseUrlObj.hostname) {
        return pages
    }

    const normalizedURL = normalizeURL(currentURL)

    if (pages[normalizedURL] > 0) {
        pages[normalizedURL]++
        return pages
    }

    if (currentURL === baseURL) {
        pages[normalizedURL] = 0
    } else {
        pages[normalizedURL] = 1
    }

    console.log(`crawling ${currentURL}`)
    let htmlBody = ''
    try {
        const resp = await fetch(currentURL)
        if (resp.status > 399) {
            console.log(`Got HTTP error, status code: ${resp.status}`)
            return pages
        }
        const contentType = resp.headers.get('content-type')
        if (!contentType.includes('text/html')) {
            console.log(`Got non-html response: ${contentType}`)
            return pages
        }
        htmlBody = await resp.text()
    } catch (err) {
        console.log(err.message)
    }

    const nextURLs = getURLsFromHTML(htmlBody, baseURL)
    for (const nextURL of nextURLs) {
        pages = await crawlPage(baseURL, nextURL, pages)
    }

    return pages
}

module.exports = {
    normalizeURL,
    getURLsFromHTML,
    crawlPage,
}
