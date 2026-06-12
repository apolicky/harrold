const ROLE_ATTRIBUTE = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'

export interface SamlAttribute {
  name: string
  values: string[]
  isRole: boolean
}

export interface SamlParseResult {
  attributes: SamlAttribute[]
  roles: string[]
  formattedXml: string
  rawXml: string
}

function decodeBase64(b64: string): string {
  const binary = atob(b64.replace(/\s+/g, ''))
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return new TextDecoder('utf-8').decode(bytes)
}

function formatNode(node: Node, depth: number): string {
  const indent = '  '.repeat(depth)

  if (node.nodeType === Node.TEXT_NODE) {
    const text = (node.textContent ?? '').trim()
    return text ? indent + text : ''
  }

  if (node.nodeType !== Node.ELEMENT_NODE) return ''

  const el = node as Element
  const attrs = Array.from(el.attributes)
    .map((a) => ` ${a.name}="${a.value}"`)
    .join('')

  const children = Array.from(el.childNodes)
    .map((child) => formatNode(child, depth + 1))
    .filter((s) => s.length > 0)

  if (children.length === 0) return `${indent}<${el.tagName}${attrs}/>`

  if (children.length === 1 && el.childNodes[0]?.nodeType === Node.TEXT_NODE) {
    return `${indent}<${el.tagName}${attrs}>${el.textContent?.trim() ?? ''}</${el.tagName}>`
  }

  return `${indent}<${el.tagName}${attrs}>\n${children.join('\n')}\n${indent}</${el.tagName}>`
}

function formatXml(doc: Document): string {
  return '<?xml version="1.0" encoding="UTF-8"?>\n' + formatNode(doc.documentElement, 0)
}

export function parseSaml(samlResponseRaw: string): SamlParseResult {
  const rawXml = decodeBase64(samlResponseRaw)

  const parser = new DOMParser()
  const doc = parser.parseFromString(rawXml, 'text/xml')

  const parseError = doc.querySelector('parsererror')
  if (parseError) {
    throw new Error('Failed to parse SAML XML: ' + parseError.textContent)
  }

  const attributes = Array.from(doc.querySelectorAll('AttributeStatement Attribute'))
    .map((el) => {
      const name = el.getAttribute('Name') ?? el.getAttribute('name') ?? ''
      const values = Array.from(el.querySelectorAll('AttributeValue')).map(
        (v) => v.textContent ?? ''
      )
      return { name, values, isRole: name === ROLE_ATTRIBUTE }
    })
    .filter((a) => a.name !== '')

  const roles = attributes
    .filter((a) => a.isRole)
    .flatMap((a) => a.values)

  return {
    attributes,
    roles,
    formattedXml: formatXml(doc),
    rawXml,
  }
}
