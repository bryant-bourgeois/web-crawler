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

async function crawlPage(baseURL, currentURL, pages, count = 0) {
    if (count >= 100) {
        console.log(pages)
        return pages
    }
    count++
    const normCurrentURL = normalizeUrl(currentURL)
    if (pages[normCurrentURL] !== undefined) {
        pages[normCurrentURL] += 1
        return pages
    } else {
        if (normCurrentURL === normalizeUrl(baseURL)) {
            pages[normCurrentURL] = 0
        } else {
            pages[normCurrentURL] = 1
        }
    }

    console.log(`Fetching ${normCurrentURL} ...`)

    async function getPage(URL) {
        return await fetch(URL)
    }

    let response;
    try {
        response = await getPage('https://' + normCurrentURL)
    } catch (e) {
        console.error(e.message)
    }
    const contentType = (response?.headers.get('content-type'))
    if (contentType === undefined) {
        return pages
    }

    if (response.status >= 400 && response.status <= 599) {
        console.log(`Error in request: HTTP response code ${response.status}, ${response.statusText}`)
        return pages
    } else if (!contentType.includes('text/html')) {
        console.log(`Error in request. Response data is not of ContentType: text/html`)
        return pages
    }
    let htmlPage;
    const parsed = await response.text()
        .then(data => htmlPage = data)

    const links = getURLsFromHTML(htmlPage, baseURL)

    let newPages
    for (const link of links) {
        newPages = crawlPage(baseURL, link, pages)
    }

    return await newPages
}

module.exports = {
    normalizeUrl,
    getURLsFromHTML,
    crawlPage,
}
