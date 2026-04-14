import { useAuth } from "$/pages/authentication/hooks";
import clsx from "clsx";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

const menuItems = [
  { label: "Profile", to: "/account/profile" },
  { label: "Addresses", to: "/account/addresses" },
  { label: "Orders", to: "/account/orders" },
  { label: "Favorites", to: "/account/favorites" },
];

export function AccountLayout() {
  const { setToken, user } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    setToken("");
    navigate("/");
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="space-y-1 mb-8">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          My Account
        </h1>
        {user ? (
          <p className="text-sm text-muted-foreground">
            Welcome back, {user.firstname}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Aside menu */}
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

        {/* Page content */}
        <div className="flex-1 min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
