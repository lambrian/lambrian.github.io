import { Client } from '@notionhq/client'
import * as fs from 'fs'
import dotenv from 'dotenv'

dotenv.config()

const QUEENS_DB_ID = '13c413f810be8070b6aedc3d1e0bb330'

const notion = new Client({
    auth: process.env.NOTION_TOKEN,
})
interface Board {
    date: string
    grid: Array<number>
}

async function fetchBoardFromNotionPage(pageId: string): Promise<Board> {
    const response2: any = await notion.pages.retrieve({
        page_id: pageId,
    })
    if (!response2.properties) {
        return { date: '', grid: [] }
    }
    const date = response2.properties.Date?.date?.start
    const colorArrayVal = response2.properties['Color Array']?.rich_text
    if (date && colorArrayVal.length > 0) {
        const boardStr = colorArrayVal[0].plain_text
        return { date, grid: JSON.parse(boardStr) }
    }

    return { date: '', grid: [] }
}

async function main2() {
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

    const pages = response.results.map((object) => object.id)

    const outputFile = '../brianl.am/src/board-data.json'
    console.log(`Fetching ${pages.length} pages`)
    await Promise.all(
        pages.map((pageId) => fetchBoardFromNotionPage(pageId))
    ).then((boards: Array<{ date: string; grid?: Array<number> }>) => {
        const validBoards = boards.filter((board) => board['date'] !== '')
        console.log(validBoards)
        fs.writeFileSync(outputFile, JSON.stringify(validBoards))
    })

    console.log('Done.')
}

main2()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err)
        process.exit(1)
    })
