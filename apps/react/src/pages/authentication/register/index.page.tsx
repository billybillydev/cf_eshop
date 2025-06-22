import { useAuth } from "$pages/authentication/hooks";
import { useRegister } from "$pages/authentication/register/hooks";
import clsx from "clsx";
import { useState } from "react";
import { redirect } from "react-router-dom";

export function RegisterPage() {
  const { setToken } = useAuth();

  const [username, setUsername] = useState("");
  const [firstname, setFirstname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    useRegister(username, firstname, email, password)
      .then((res) => {
        if (!res.success) {
          setError(res.error);
        } else {
          setToken(res.token);
          setPassword("");
          setEmail("");
          setUsername("");
          setFirstname("");
          redirect("/");
        }
      })
      .finally(() => setIsPending(false));
  };

  return (
    <div className="container space-y-8 mx-auto">
      <h1 className="text-center">Create an account</h1>
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
          <label htmlFor="username">Username</label>
          <input
            id="username"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            placeholder="Your username"
            required
          />
        </section>

        <section>
          <label htmlFor="firstname">Firstname</label>
          <input
            id="firstname"
            onChange={(e) => setFirstname(e.target.value)}
            value={firstname}
            placeholder="Your firstname"
            required
          />
        </section>

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
        <a href="/login" className="link">
          Already an account ? Sign in here
        </a>
      </div>
    </div>
  );
}
