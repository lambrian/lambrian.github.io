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

    fs.writeFileSync(
        '../brianl.am/src/notion-data.json',
        JSON.stringify(response)
    )
    console.log('Done.')
}

main()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err)
        process.exit(1)
    })
