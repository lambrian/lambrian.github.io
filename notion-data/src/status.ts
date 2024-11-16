import { Client } from '@notionhq/client'
import * as fs from 'fs'
import dotenv from 'dotenv'

dotenv.config()

const DB_ID = '139413f810be801b916edc5da7e5a7b5'

async function main() {
    const notion = new Client({
        auth: process.env.NOTION_TOKEN,
    })

    const response = await notion.databases.query({
        database_id: DB_ID,
        sorts: [
            {
                property: 'Calculated Date',
                direction: 'ascending',
            },
        ],
    })
    const result = []
    const pages: any[] = response.results
    for (let i = 0; i < pages.length; i++) {
        const page = pages[i]
        result.push({
            date: page?.properties.Date.formula.string,
            location: page.properties.Location.select.name,
        })
    }

    fs.writeFileSync(
        '../brianl.am/src/notion-data.json',
        JSON.stringify(result)
    )
    console.log('Done.')
}

main()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err)
        process.exit(1)
    })
