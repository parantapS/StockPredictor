import fs from 'fs'
import path from 'path'

const CACHE_FILE = path.resolve('cache/stockCache.json');
const CACHE_TTL = 1000 * 60 * 60 * 24 // 24 hours

console.log('Using cache file at:', CACHE_FILE);

// Load cache from disk on startup
let cache = {}
if (fs.existsSync(CACHE_FILE)) {
  const fileContents = fs.readFileSync(CACHE_FILE, 'utf-8').trim()
  cache = fileContents ? JSON.parse(fileContents) : {}
}

// Save cache to disk
function saveCache() {
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2))
}

// Get from cache
function getCache(key) {
  const entry = cache[key]
  if (!entry) return null

  const isExpired = Date.now() - entry.timestamp > CACHE_TTL
  if (isExpired) {
    console.log(`Cache expired for key: ${key}`)
    delete cache[key]
    saveCache()
    return null
  }

  // ✅ Return cached data if valid
  return entry.data
}

// Set cache
function setCache(key, value) {
  try {
    cache[key] = {
      data: value,
      timestamp: Date.now()
    }
    saveCache()
    console.log(`Cache saved for key: ${key}`)
  } catch (error) {
    console.error("Failed to write cache:", err)
  }
  
}

export { getCache, setCache }
