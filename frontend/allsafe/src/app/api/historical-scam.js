import fs from 'fs'
import path from 'path'
import { parse } from 'csv-parse/sync'

export default function handler(req, res) {
    const filePath = path.join(process.cwd(), 'public', 'historical_scam.csv')
    const fileContent = fs.readFileSync(filePath, 'utf8')
    const records = parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
    })
    res.status(200).json(records)
}
