import fs from 'fs'
import path from 'path'

function dataPath(name: string) {
  return path.resolve(process.cwd(), 'data', name)
}

export function readJSON<T = any>(name: string): T {
  const p = dataPath(name)
  try {
    if (!fs.existsSync(p)) return {} as T
    const raw = fs.readFileSync(p, 'utf-8')
    return JSON.parse(raw) as T
  } catch (err) {
    throw new Error(`Failed to read ${name}: ${String(err)}`)
  }
}

export function writeJSON<T = any>(name: string, data: T) {
  const p = dataPath(name)
  try {
    const dir = path.dirname(p)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf-8')
  } catch (err) {
    throw new Error(`Failed to write ${name}: ${String(err)}`)
  }
}
