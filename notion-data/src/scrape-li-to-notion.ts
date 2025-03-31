import { Client } from '@notionhq/client'
import dotenv from 'dotenv'
import puppeteer from 'puppeteer'
import { DateTime } from 'luxon'

dotenv.config()

const QUEENS_DB_ID = '13c413f810be8070b6aedc3d1e0bb330'
const QUEENS_URL = 'https://www.linkedin.com/games/queens'
const START_BTN = '#launch-footer-start-button'

async function fetchTodayGame() {
    const url = QUEENS_URL
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(url, { waitUntil: 'domcontentloaded' })
    const iframeElement = await page.waitForSelector('iframe')
    const iframe = await iframeElement?.contentFrame()
    if (iframe) {
        await iframe.waitForSelector('body')
        await iframe.waitForSelector(START_BTN)
        await iframe.click(START_BTN)
        const grid = await iframe.$('#queens-grid')
        const cells = await grid?.evaluate((gridEl) => {
            const children = gridEl.children
            const cellColors: any[] = []
            for (let i = 0; i < children.length; i++) {
                const childClassName = children[i].className
                const colorNumStr = childClassName.match(/\d+/)
                if (colorNumStr?.length) {
                    const colorNumStrMatch = colorNumStr[0]
                    const colorNum = parseInt(colorNumStrMatch)
                    cellColors.push(colorNum)
                }
            }
            return cellColors
        })
        console.log(cells)

        console.log(JSON.stringify(cells))
        return cells
    }

    return null
}

const isBoardValid = (cellColors: any) => {
    const sqrtLength = Math.sqrt(cellColors.length)
    const seenColors = new Set()
    for (let i = 0; i < cellColors.length; i++) {
        seenColors.add(cellColors[i])
    }

    return (
        sqrtLength === Math.floor(sqrtLength) && sqrtLength === seenColors.size
    )
}

async function main() {
    // read json of output
    // write back to notion
    // fetch all dates
    const notion = new Client({
        auth: process.env.NOTION_TOKEN,
    })

    const response = await notion.databases.query({
        database_id: QUEENS_DB_ID,
        sorts: [
            {
                property: 'Date',
                direction: 'descending',
            },
        ],
    })

    const latestPage: any = response.results.length && response.results.at(0)
    const latestDate = latestPage.properties.Date.date.start
    const todayDate = DateTime.local()
        .setZone('America/Los_Angeles')
        .toFormat('yyyy-MM-dd')
    if (latestDate === todayDate) {
        console.log('Notion already has a row for today.')
        return
    }

    const cellColors = await fetchTodayGame()
    console.log('cell colors', cellColors)
    if (!isBoardValid(cellColors)) {
        console.log('Fetched board is not valid.')
        return
    }

    await notion.pages.create({
        parent: {
            type: 'database_id',
            database_id: QUEENS_DB_ID,
        },
        properties: {
            Date: {
                start: todayDate,
            },
            'Color Array': [{ text: { content: JSON.stringify(cellColors) } }],
        },
    })
}

main()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err)
        process.exit(1)
    })
