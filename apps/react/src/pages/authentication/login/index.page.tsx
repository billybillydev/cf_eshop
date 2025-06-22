import { useAuth } from "$pages/authentication/hooks";
import { useLogin } from "$pages/authentication/login/hooks";
import clsx from "clsx";
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
    <div className="container space-y-8 mx-auto">
      <h1 className="text-center">Login</h1>
      {error ? <p className="text-red-500 text-center">{error}</p> : null}
      <form
        className={clsx(
          "flex flex-col gap-y-4 max-w-lg mx-auto justify-center items-center border p-4 rounded",
          "[&>section]:flex [&>section]:flex-col [&>section]:gap-y-2 [&>section]:w-full",
          "[&>section>input]:text-black"
        )}
        onSubmit={handleSubmit}
      >
        <section>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="Your email"
            type="email"
            required
          />
        </section>

        <section>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="Your password"
            required
          />
        </section>

        <section>
          <button
            className="btn btn-secondary"
            disabled={isPending}
            type="submit"
          >
            {isPending ? "Loading..." : "Submit"}
          </button>
        </section>
      </form>

      <div className="p-4 text-center">
        <a href="/register" className="link">
          Not yet registered ? Create an account.
        </a>
      </div>
    </div>
  );
}
