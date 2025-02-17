import { Client } from '@notionhq/client'
import * as fs from 'fs'
import dotenv from 'dotenv'

dotenv.config()

const QUEENS_DB_ID = '13c413f810be8070b6aedc3d1e0bb330'

async function main2() {
    const notion = new Client({
        auth: process.env.NOTION_TOKEN,
    })

    const response = await notion.databases.query({
        database_id: QUEENS_DB_ID,
    })

    const pages = response.results.map((object) => object.id)

    const outputDir = '../queens-image-analysis/board_img'
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir)
    }
    for (let i = 0; i < pages.length; i++) {
        const pageId = pages[i]
        const response2: any = await notion.pages.retrieve({
            page_id: pageId,
        })
        const sideLength = response2.properties['Color Count'].number
        const colorArrayVal = response2.properties['Color Array']?.rich_text
        if (!colorArrayVal.length) {
            const pageQueensPhoto = response2?.cover?.file?.url
            if (!pageQueensPhoto) {
                continue
            }
            const response3 = await fetch(pageQueensPhoto)
            const buffer = Buffer.from(await response3.arrayBuffer())
            console.log(`Downloaded board image from ${pageId}.`)
            fs.writeFileSync(
                `../queens-image-analysis/board_img/${pageId}#${sideLength}`,
                buffer
            )
        }
    }
    console.log('Done.')
}

main2()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err)
        process.exit(1)
    })
