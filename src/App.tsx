import { useState } from 'react'
import { FileUpload } from './components/FileUpload'
import { EntrySelector } from './components/EntrySelector'
import { RolesList } from './components/RolesList'
import { AttributesTable } from './components/AttributesTable'
import { XmlViewer } from './components/XmlViewer'
import { parseHar, HarSamlEntry } from './utils/harParser'
import { parseSaml, SamlParseResult } from './utils/samlParser'
import './App.css'

type AppState =
  | { phase: 'idle' }
  | { phase: 'error'; message: string }
  | { phase: 'select'; entries: HarSamlEntry[]; filename: string }
  | { phase: 'result'; result: SamlParseResult; url: string; filename: string }

function errorMessage(e: unknown): string {
  return e instanceof Error ? e.message : String(e)
}

export default function App() {
  const [state, setState] = useState<AppState>({ phase: 'idle' })

  function setError(e: unknown) {
    setState({ phase: 'error', message: errorMessage(e) })
  }

  function handleFile(text: string, filename: string) {
    try {
      const entries = parseHar(text)
      if (entries.length === 0) {
        setState({ phase: 'error', message: 'No SAML broker endpoint calls found in this HAR file.' })
        return
      }
      if (entries.length === 1) {
        processEntry(entries[0], filename)
      } else {
        setState({ phase: 'select', entries, filename })
      }
    } catch (e) {
      setError(e)
    }
  }

  function processEntry(entry: HarSamlEntry, filename: string) {
    try {
      const result = parseSaml(entry.samlResponseRaw)
      setState({ phase: 'result', result, url: entry.url, filename })
    } catch (e) {
      setError(e)
    }
  }

  function reset() {
    setState({ phase: 'idle' })
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Harrold - SAML Roles from HAR</h1>
        {state.phase !== 'idle' && (
          <button className="reset-btn" onClick={reset}>Load another file</button>
        )}
      </header>

      <main className="app-main">
        {state.phase === 'idle' && <FileUpload onFile={handleFile} onError={setError} />}

        {state.phase === 'error' && (
          <div className="error-box">
            <strong>Error:</strong> {state.message}
            <button className="reset-btn" onClick={reset}>Try again</button>
          </div>
        )}

        {state.phase === 'select' && (
          <EntrySelector
            entries={state.entries}
            onSelect={(entry) => processEntry(entry, state.filename)}
          />
        )}

        {state.phase === 'result' && (
          <div className="results">
            <div className="result-meta">
              <span className="meta-label">File:</span> {state.filename}
              <span className="meta-sep">·</span>
              <span className="meta-label">Endpoint:</span> <code>{state.url}</code>
            </div>
            <RolesList roles={state.result.roles} />
            <AttributesTable attributes={state.result.attributes} />
            <XmlViewer xml={state.result.formattedXml} />
          </div>
        )}
      </main>
      <footer className="app-footer">
        <a href="https://github.com/apolicky/harrold#readme" target="_blank" rel="noreferrer">README</a>
      </footer>
    </div>
  )
}
