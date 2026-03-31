"use client";

import { useAuth } from "$pages/authentication/hooks";
import { useCartContext } from "$pages/cart/hooks";
import { Logo } from "$shared/components/logo.components";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export function Header() {
  const authClass =
    "inline-flex h-9 items-center rounded-md px-3 text-sm font-medium bg-primary text-primary-foreground hover:opacity-95";
  const { token, setToken } = useAuth();
  const { cart } = useCartContext();

  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      setToken("");
      router.push("/login");
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-14 items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2">
            <Logo />
            <span className="hidden sm:inline text-sm text-muted-foreground">
              Minimal commerce demo
            </span>
          </Link>

          <nav className="flex items-center gap-2">
            {token ? (
              <Link
                href="/"
                className="hidden sm:inline-flex h-9 items-center rounded-md px-3 text-sm font-medium bg-secondary text-secondary-foreground"
                aria-current="page"
              >
                Products
              </Link>
            ) : null}
            <Link
              href="/contact"
              className="hidden sm:inline-flex h-9 items-center rounded-md px-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              Contact
            </Link>

            {token ? (
              <Link
                href="/cart"
                className="relative inline-flex h-9 items-center rounded-md px-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
              >
                Cart
                <span className="ml-2 inline-flex min-w-6 justify-center rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
                  {cart?.items.length ?? 0}
                </span>
              </Link>
            ) : null}

            {token ? (
              <button onClick={handleLogout} className={authClass}>
                Logout
              </button>
            ) : pathname !== "/login" &&
              pathname !== "/register" ? (
              <Link href="/login" className={authClass}>
                Login
              </Link>
            ) : null}
          </nav>
        </div>
      </div>
    </header>
  );
}
