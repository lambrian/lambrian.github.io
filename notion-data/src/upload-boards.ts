import { Client } from '@notionhq/client'
import * as fs from 'fs'
import dotenv from 'dotenv'

dotenv.config()

async function main() {
    // read json of output
    // write back to notion
    const notion = new Client({ auth: process.env.NOTION_TOKEN })
    const outputJson = fs.readFileSync('../queens-image-analysis/output.json', {
        encoding: 'utf8',
        flag: 'r',
    })
    const pageToBoard = JSON.parse(outputJson)
    for (const page in pageToBoard) {
        const pageId = page
        await notion.pages.update({
            page_id: pageId,
            properties: {
                'Color Array': {
                    rich_text: [
                        {
                            text: {
                                content: JSON.stringify(pageToBoard[page]),
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
