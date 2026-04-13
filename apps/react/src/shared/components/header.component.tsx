
import { useAuth } from "$/pages/authentication/hooks";
import { useCartContext } from "$/pages/cart/hooks";
import { Logo } from "$/shared/components/logo.components";
import { useEffect, useRef, useState } from "react";
import { NavLink, redirect, useLocation } from "react-router-dom";

export function Header() {
  const authClass =
    "inline-flex h-9 items-center rounded-md px-3 text-sm font-medium bg-primary text-primary-foreground hover:opacity-95";
  const location = useLocation();
  const { token, setToken } = useAuth();
  const { cart } = useCartContext();

  const handleLogout = () => {
    setToken("");

    redirect("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-14 items-center justify-between gap-3">
          <NavLink to="/" className="flex items-center gap-2">
            <Logo />
            <span className="hidden sm:inline text-sm text-muted-foreground">
              Minimal commerce demo
            </span>
          </NavLink>

          <nav className="flex items-center gap-2">
            <NavLink
              to="/"
              className="hidden sm:inline-flex h-9 items-center rounded-md px-3 text-sm font-medium bg-secondary text-secondary-foreground"
              aria-current="page"
            >
              Products
            </NavLink>
            
            <NavLink
              to="/contact"
              className="hidden sm:inline-flex h-9 items-center rounded-md px-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              Contact
            </NavLink>

            <NavLink
              to="/cart"
              className="relative inline-flex h-9 items-center rounded-md px-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              Cart
              <span className="ml-2 inline-flex min-w-6 justify-center rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
                {cart?.items.length ?? 0}
              </span>
            </NavLink>

            {token ? (
              <UserPopover onLogout={handleLogout} />
            ) : location.pathname !== "/login" &&
              location.pathname !== "/register" ? (
              <NavLink to="/login" className={authClass}>
                Login
              </NavLink>
            ) : null}
          </nav>
        </div>
      </div>
    </header>
  );
}

function UserPopover({ onLogout }: { onLogout: () => void }) {
  const [open, setOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [
    { to: "/profile", label: "Profile" },
    { to: "/orders", label: "Orders" },
    { to: "/favorites", label: "Favorites" },
  ];

  return (
    <div className="relative" ref={popoverRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-95"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 rounded-lg border border-border bg-card shadow-lg py-1 z-50">
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
            >
              {item.label}
            </NavLink>
          ))}
          {/* <div className="border-t border-border my-1" /> */}
          {/* <button
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
            className="block w-full border-t mt-2 border-border text-left px-4 py-2 text-sm text-destructive hover:bg-accent"
          >
            Logout
          </button> */}
        </div>
      )}
    </div>
  );
}
