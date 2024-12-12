import { Client } from '@notionhq/client'
import * as fs from 'fs'
import dotenv from 'dotenv'
import { getFileKB } from './utils.ts'

dotenv.config()

const DB_ID = '1f95b4aedadc45308cce02a2be949e73'

async function main() {
    const notion = new Client({
        auth: process.env.NOTION_TOKEN,
    })

    const response = await notion.databases.query({
        database_id: DB_ID,
        sorts: [
            {
                property: 'Calculated Date',
                direction: 'descending',
            },
        ],
    })
    const pages: any[] = response.results
    const result = pages.map((page) => ({
        date: page?.properties.Date.formula.string,
        location: page.properties.Location.select.name,
    }))
    result.reverse()

    const outputFile = '../brianl.am/src/notion-data.json'
    fs.writeFileSync(outputFile, JSON.stringify(result))
    console.log(`File size: ${getFileKB(outputFile)}KB`)
    console.log('Done.')
}

main()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err)
        process.exit(1)
    })
