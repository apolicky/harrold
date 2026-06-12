import { SamlAttribute } from '../utils/samlParser'

interface Props {
  attributes: SamlAttribute[]
}

export function AttributesTable({ attributes }: Props) {
  return (
    <section className="panel">
      <h2>All Claims <span className="badge">{attributes.length}</span></h2>
      <div className="table-wrap">
        <table className="claims-table">
          <thead>
            <tr>
              <th>Attribute Name</th>
              <th>Values</th>
            </tr>
          </thead>
          <tbody>
            {attributes.map((attr, i) => (
              <tr key={i} className={attr.isRole ? 'row--role' : ''}>
                <td className="attr-name">{attr.name}</td>
                <td>
                  <ul className="value-list">
                    {attr.values.map((v, j) => <li key={j}>{v}</li>)}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
