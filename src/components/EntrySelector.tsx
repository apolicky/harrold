import { HarSamlEntry } from '../utils/harParser'

interface Props {
  entries: HarSamlEntry[]
  onSelect: (entry: HarSamlEntry) => void
}

export function EntrySelector({ entries, onSelect }: Props) {
  return (
    <div className="entry-selector">
      <h2>Multiple SAML entries found — pick one</h2>
      <ul>
        {entries.map((entry, i) => (
          <li key={i}>
            <button className="entry-btn" onClick={() => onSelect(entry)}>
              <span className="entry-index">#{i + 1}</span>
              <span className="entry-url">{entry.url}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
