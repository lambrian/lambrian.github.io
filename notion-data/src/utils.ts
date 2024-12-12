import * as fs from 'fs'

export const getFileKB = (filename: string) => {
    return Math.round((fs.statSync(filename).size / 1024) * 100) / 100
}
