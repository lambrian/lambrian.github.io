import { Client } from '@notionhq/client'
import dotenv from 'dotenv'

dotenv.config()

// Used this as a utility to transfer all manually input boards from a local
// file to Notion
const BOARDS: { date: string; grid: number[] }[] = []
const QUEENS_DB_ID = '13c413f810be8070b6aedc3d1e0bb330'

async function main() {
    // read json of output
    // write back to notion
    const notion = new Client({ auth: process.env.NOTION_TOKEN })

    for (let i = 0; i < BOARDS.length; i++) {
        await notion.pages.create({
            parent: {
                type: 'database_id',
                database_id: QUEENS_DB_ID,
            },
            properties: {
                'Color Count': {
                    number: Math.sqrt(BOARDS[i].grid.length),
                },
                Date: {
                    date: {
                        start: BOARDS[i].date,
                    },
                },
                'Color Array': {
                    rich_text: [
                        {
                            text: {
                                content: JSON.stringify(BOARDS[i].grid),
                            },
                        },
                    ],
                },
            },
        })
    }
}

main()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err)
        process.exit(1)
    })
