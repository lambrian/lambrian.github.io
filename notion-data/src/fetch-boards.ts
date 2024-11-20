import { Client } from '@notionhq/client'
import * as fs from 'fs'
import dotenv from 'dotenv'

dotenv.config()

const QUEENS_DB_ID = '13c413f810be8070b6aedc3d1e0bb330'

interface Board {
    date?: string
    grid: Array<number>
}

async function main() {
    const outputFile = '../brianl.am/src/board-data.json'
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

    const pages: any[] = response.results
    const boards = pages
        .map((page): Board => {
            const colorArrJson = page.properties['Color Array']
            const date = page.properties.Date?.date?.start
            if (date && colorArrJson) {
                try {
                    const grid = JSON.parse(colorArrJson)
                    return {
                        date,
                        grid,
                    }
                } catch (e: any) {
                    console.log(`Failed while parsing page ${page.id}`)
                    return { date: '', grid: [] }
                }
            }
            return { date: undefined, grid: [] }
        })
        .filter((board: Board) => board.date)

    fs.writeFileSync(outputFile, JSON.stringify(boards))
    console.log('Done.')
}

main()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err)
        process.exit(1)
    })
