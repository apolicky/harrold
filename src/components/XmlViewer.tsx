import { useState } from 'react'

interface Props {
  xml: string
}

export function XmlViewer({ xml }: Props) {
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard.writeText(xml)
      .then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
      .catch(() => { setCopied(false) })
  }

  return (
    <section className="panel panel--xml">
      <div className="panel-header">
        <h2>raw XML</h2>
        <button className="copy-btn" onClick={copy}>
          {copied ? 'copied!' : 'copy'}
        </button>
      </div>
      <pre className="xml-pre"><code>{xml}</code></pre>
    </section>
  )
}
