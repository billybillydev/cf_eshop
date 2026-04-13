import { useAuth } from "$/pages/authentication/hooks";
import { useLogin } from "$/pages/authentication/login/hooks";
import { useState } from "react";
import { redirect } from "react-router-dom";

export function LoginPage() {
  const { setToken } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    useLogin(email, password)
      .then((res) => {
        if (!res.success) {
          setError(res.error);
        } else {
          setToken(res.token);
          setPassword("");
          setEmail("");
          redirect("/");
        }
      })
      .finally(() => setIsPending(false));
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mx-auto max-w-md">
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign in to access your cart, orders, and account settings.
          </p>
        </div>

        <section className="mt-6 rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="h-1 bg-primary"></div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@domain.com"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm shadow-sm
                           placeholder:text-muted-foreground focus:ring-2 ring-ring"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <a
                  href="/forgot-password"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Forgot password?
                </a>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm shadow-sm
                           placeholder:text-muted-foreground focus:ring-2 ring-ring"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  className="size-4 rounded border-border text-[hsl(var(--primary))] focus:ring-2 ring-ring"
                />
                Remember me
              </label>

              <span className="text-xs text-muted-foreground">
                Secure login
              </span>
            </div>

            {error ? (
              <p className="text-red-600 text-center my-4">{error}</p>
            ) : null}

            <button
              type="submit"
              disabled={isPending}
              className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium
                         text-primary-foreground shadow-sm hover:opacity-95 focus:ring-2 ring-ring"
            >
              {isPending ? "Loading..." : "Sign In"}
            </button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-card px-2 text-xs text-muted-foreground">
                  or
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                className="inline-flex h-10 items-center justify-center rounded-lg border border-border bg-card px-3 text-sm font-medium
                           hover:bg-accent hover:text-accent-foreground"
              >
                Continue with GitHub
              </button>
              <button
                type="button"
                className="inline-flex h-10 items-center justify-center rounded-lg border border-border bg-card px-3 text-sm font-medium
                           hover:bg-accent hover:text-accent-foreground"
              >
                Continue with Google
              </button>
            </div>
          </form>
        </section>

        <p className="mt-5 text-center text-sm text-muted-foreground space-x-2">
          <span>Not registered yet ?</span>
          <a
            href="/register"
            className="font-medium text-foreground hover:underline"
          >
            Create an account
          </a>
          .
        </p>
      </div>
    </div>
  );
}
