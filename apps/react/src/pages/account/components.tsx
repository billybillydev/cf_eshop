import { NavLink } from "react-router-dom";
import { clsx } from "clsx";

export function AccountAsideMenu({
  menuItems,
  handleLogout,
}: {
  menuItems: Array<{ to: string; label: string }>;
  handleLogout: () => void;
}) {
  return (
    <aside className="w-full md:w-56 shrink-0">
      <nav className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <ul className="divide-y divide-border">
          {menuItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  clsx(
                    "block px-4 py-3 text-sm font-medium transition",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
          <li>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 text-sm font-medium text-destructive hover:bg-destructive/10 transition"
            >
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
