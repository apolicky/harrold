interface Props {
  roles: string[];
}

export function RolesList({ roles }: Props) {
  return (
    <section className="panel">
      <h2>
        roles <span className="badge">{roles.length}</span>
      </h2>
      {roles.length > 0 ? (
        <ul className="roles-list">
          {roles.map((role, i) => (
            <li key={i} className="role-chip">
              {role}
            </li>
          ))}
        </ul>
      ) : (
        <p className="empty">no role claims found</p>
      )}
    </section>
  );
}
