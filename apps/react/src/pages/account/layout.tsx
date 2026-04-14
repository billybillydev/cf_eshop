import { AccountAsideMenu } from "$/pages/account/components";
import { useAuth } from "$/pages/authentication/hooks";
import clsx from "clsx";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";

const menuItems = [
  { label: "Profile", to: "/account/profile" },
  { label: "Addresses", to: "/account/addresses" },
  { label: "Orders", to: "/account/orders" },
  { label: "Favorites", to: "/account/favorites" },
];

export function AccountLayout() {
  const { setToken, user } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

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

      <div className="flex gap-8">
        <div className={pathname === "/account" ? "w-full" : "hidden md:block"}>
          <AccountAsideMenu menuItems={menuItems} handleLogout={handleLogout} />
        </div>

        <div className={pathname === "/account" ? "hidden" : "flex-1 min-w-0"}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
