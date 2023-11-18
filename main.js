'use strict';
const {crawlPage} = require("./crawl");

function main() {
    if (process.argv.length < 3) {
        console.log('no website provided')
        console.log(process.argv)
        process.exit(1)
    } else if (process.argv.length > 3) {
        console.log('Too many arguments provided.')
        process.exit(1)
    } else {
        console.log(`Crawler is starting at ${process.argv[2]} ...`)
    }

    // const report = crawlPage(process.argv[2], process.argv[2], {}).then(data => data)

    async function printReport() {
        const report = await crawlPage(process.argv[2], process.argv[2], {})
        console.log(report)
    }

    printReport()
}

main()
