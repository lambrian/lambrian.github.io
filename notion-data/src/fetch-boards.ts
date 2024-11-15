import { Client } from '@notionhq/client'
import * as fs from 'fs'
import dotenv from 'dotenv'

dotenv.config()

const QUEENS_DB_ID = '13c413f810be8070b6aedc3d1e0bb330'

interface Board {
    date: string
    grid: Array<number>
}

async function main2() {
    const notion = new Client({
        auth: process.env.NOTION_TOKEN,
    })

    const response = await notion.databases.query({
        database_id: QUEENS_DB_ID,
    })

    const pages = response.results.map((object) => object.id)

    const outputFile = '../brianl.am/src/board-data.json'
    const dateToBoard: Array<Board> = [] // : Map<string, Array<number>> = new Map()
    for (let i = 0; i < pages.length; i++) {
        const pageId = pages[i]
        const response2: any = await notion.pages.retrieve({
            page_id: pageId,
        })
        const date = response2.properties.Date?.date?.start
        const boardStr =
            response2.properties['Color Array']?.rich_text[0].plain_text
        dateToBoard.push({ date, grid: JSON.parse(boardStr) })
    }
    fs.writeFileSync(outputFile, JSON.stringify(dateToBoard))
    console.log('Done.')
}

main2()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err)
        process.exit(1)
    })
