interface Props {
  roles: string[]
}

export function RolesList({ roles }: Props) {
  if (roles.length === 0) {
    return (
      <section className="panel">
        <h2>Roles</h2>
        <p className="empty">No role claims found</p>
      </section>
    )
  }

  return (
    <section className="panel">
      <h2>Roles <span className="badge">{roles.length}</span></h2>
      <ul className="roles-list">
        {roles.map((role, i) => (
          <li key={i} className="role-chip">{role}</li>
        ))}
      </ul>
    </section>
  )
}
