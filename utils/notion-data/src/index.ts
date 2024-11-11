import { Client } from '@notionhq/client'
import * as fs from 'fs'
import { DateTime } from 'luxon'

async function main() {
    const notion = new Client({
        auth: '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',
    })

    const response = await notion.databases.query({
        database_id: '139413f810be801b916edc5da7e5a7b5',
        sorts: [
            {
                property: 'Calculated Date',
                direction: 'ascending',
            },
        ],
    })

    fs.writeFileSync('../../src/notion-data.json', JSON.stringify(response))
    console.log('Done.')
}

async function writeToNotion() {
    const notion = new Client({
        auth: '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',
    })

    for (let i = 0; i < 30; i++) {
        let dateToCreate = DateTime.local(2024, 9, 14)
            .minus({ days: i })
            .toFormat('yyyy-MM-dd')
        console.log(dateToCreate)
        const response = await notion.pages.create({
            parent: {
                type: 'database_id',
                database_id: '139413f810be801b916edc5da7e5a7b5',
            },
            properties: {
                'Manual Date': {
                    date: { start: dateToCreate, end: null, time_zone: null },
                },
            },
        })

        console.log(response)
    }
}

main()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err)
        process.exit(1)
    })
