// import { Client } from '@notionhq/client'
import * as fs from 'fs'
import dotenv from 'dotenv'

dotenv.config()

// const QUEENS_DB_ID = '13c413f810be8070b6aedc3d1e0bb330'

async function main() {
    // read json of output
    // write back to notion
    const outputJson = fs.readFileSync('../queens-image-analysis/output.json', {
        encoding: 'utf8',
        flag: 'r',
    })
    console.log(JSON.parse(outputJson))
}

main()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err)
        process.exit(1)
    })
