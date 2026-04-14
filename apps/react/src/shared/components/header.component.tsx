
import { useAuth } from "$/pages/authentication/hooks";
import { useCartContext } from "$/pages/cart/hooks";
import { Logo } from "$/shared/components/logo.components";
import clsx from "clsx";
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

          <nav className="flex items-center gap-2 relative">
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

            <div className="hidden md:flex">
              {token ? (
                // <UserPopover onLogout={handleLogout} />
                <>
                  <NavLink
                    to="/account/favorites"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-95"
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
                      aria-label="account"
                    >
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </NavLink>
                </>
              ) : location.pathname !== "/login" &&
                location.pathname !== "/register" ? (
                <NavLink to="/login" className={authClass}>
                  Login
                </NavLink>
              ) : null}
            </div>
            <MobileSidebar />
          </nav>
        </div>
      </div>
    </header>
  );
}

function MobileSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);

  return (
    <>
      <div className="relative md:hidden">
        <button
          type="button"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground"
          onClick={() => setIsOpen(true)}
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
            aria-hidden="true"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>

        </button>
      </div>

      {isOpen && (
        <div className="fixed top-0 left-0 w-full h-dvh">
          <div
            className="absolute z-10 inset-0 bg-black/40 w-full h-full"
            onClick={() => setIsOpen(false)}
          />
          <aside
            className="relative h-full z-20 w-64 bg-background border-r border-border shadow-lg flex flex-col"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <Logo />
              <button
                type="button"
                aria-label="Close menu"
                className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground"
                onClick={() => setIsOpen(false)}
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
                  aria-hidden="true"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <nav className="flex-1 px-4 py-4 space-y-2">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  clsx(
                    "block rounded-md px-3 py-2 text-sm font-medium",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-foreground hover:bg-accent hover:text-accent-foreground"
                  )
                }
                onClick={() => setIsOpen(false)}
              >
                Home
              </NavLink>
              <NavLink
                to="/products"
                className={({ isActive }) =>
                  clsx(
                    "block rounded-md px-3 py-2 text-sm font-medium",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-foreground hover:bg-accent hover:text-accent-foreground"
                  )
                }
                onClick={() => setIsOpen(false)}
              >
                Products
              </NavLink>
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  clsx(
                    "block rounded-md px-3 py-2 text-sm font-medium",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-foreground hover:bg-accent hover:text-accent-foreground"
                  )
                }
                onClick={() => setIsOpen(false)}
              >
                Contact
              </NavLink>
              <NavLink
                to="/account"
                className={({ isActive }) =>
                  clsx(
                    "block rounded-md px-3 py-2 text-sm font-medium",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-foreground hover:bg-accent hover:text-accent-foreground"
                  )
                }
                onClick={() => setIsOpen(false)}
              >
                Account
              </NavLink>
            </nav>
          </aside>
        </div>
      )}
    </>
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
    { to: "/account/profile", label: "Profile" },
    { to: "/account/orders", label: "Orders" },
    { to: "/account/favorites", label: "Favorites" },
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
