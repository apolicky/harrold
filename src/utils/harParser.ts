export interface HarSamlEntry {
  url: string
  samlResponseRaw: string
}

interface HarParam {
  name: string
  value: string
}

interface HarPostData {
  mimeType?: string
  params?: HarParam[]
  text?: string
}

interface HarRequest {
  method: string
  url: string
  postData?: HarPostData
}

interface HarEntry {
  request: HarRequest
}

interface HarLog {
  entries: HarEntry[]
}

interface Har {
  log: HarLog
}

const BROKER_ENDPOINT_RE = /\/broker\/[^/]+\/endpoint/

function extractSamlResponse(postData: HarPostData): string | null {
  if (postData.params) {
    const param = postData.params.find((p) => p.name === 'SAMLResponse')
    if (param) return decodeURIComponent(param.value)
  }
  if (postData.text) {
    const match = postData.text.match(/(?:^|&)SAMLResponse=([^&]+)/)
    if (match) return decodeURIComponent(match[1])
  }
  return null
}

export function parseHar(text: string): HarSamlEntry[] {
  let har: Har
  try {
    har = JSON.parse(text) as Har
  } catch {
    throw new Error('Invalid HAR file: could not parse JSON')
  }

  if (!har.log?.entries) {
    throw new Error('Invalid HAR file: missing log.entries')
  }

  const results: HarSamlEntry[] = []

  for (const entry of har.log.entries) {
    const req = entry.request
    if (req.method !== 'POST') continue
    if (!BROKER_ENDPOINT_RE.test(req.url)) continue
    if (!req.postData) continue

    const samlResponseRaw = extractSamlResponse(req.postData)
    if (samlResponseRaw) {
      results.push({ url: req.url, samlResponseRaw })
    }
  }

  return results
}
