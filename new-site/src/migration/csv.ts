import fs from 'fs'

export function escapeCsv(value: unknown): string {
  const str = value == null ? '' : String(value)
  if (/[",\n\r]/.test(str)) return `"${str.replace(/"/g, '""')}"`
  return str
}

export function writeCsv(filePath: string, rows: Record<string, unknown>[]) {
  if (!rows.length) {
    fs.writeFileSync(filePath, '')
    return
  }
  const headers = Object.keys(rows[0])
  const lines = [
    headers.join(','),
    ...rows.map((row) => headers.map((h) => escapeCsv(row[h])).join(',')),
  ]
  fs.mkdirSync(filePath.replace(/\/[^/]+$/, ''), { recursive: true })
  fs.writeFileSync(filePath, lines.join('\n'))
}

export function readCsv(filePath: string): Record<string, string>[] {
  const text = fs.readFileSync(filePath, 'utf-8')
  const lines = text.split(/\r?\n/).filter(Boolean)
  if (!lines.length) return []
  const headers = parseCsvLine(lines[0])
  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line)
    const row: Record<string, string> = {}
    headers.forEach((h, i) => {
      row[h] = values[i] || ''
    })
    return row
  })
}

function parseCsvLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') {
        current += '"'
        i++
      } else if (ch === '"') inQuotes = false
      else current += ch
    } else if (ch === '"') inQuotes = true
    else if (ch === ',') {
      result.push(current)
      current = ''
    } else current += ch
  }
  result.push(current)
  return result
}
