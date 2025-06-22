import { useSendContactEmail } from "$pages/contact/hooks";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export function ContactPage() {
  const maxMessageLength = 300;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);

  const isMaxMessageReach = message.length > maxMessageLength;

  const isSubmitButtonDisabled = isPending || isMaxMessageReach;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    useSendContactEmail(name, email, message)
      .then((res) => {
        if (!res.success) {
          setIsError(true);
        } else {
          setName("");
          setEmail("");
          setMessage("");
          toast.success("Demande de contact envoyée avec succès.");
        }
      })
      .finally(() => setIsPending(false));
  };

  useEffect(() => {
    return () => {
      setIsError(false);
      setIsPending(false);
    };
  }, []);

  return (
    <div className="container space-y-8 mx-auto">
      <h1 className="text-center">Contact</h1>
      {isError && (
        <p className="text-red-500 text-center">
          Something went wrong when sending your email
        </p>
      )}
      <form
        className={clsx(
          "flex flex-col gap-y-4 max-w-lg mx-auto justify-center items-center border p-4 rounded",
          "[&>section]:flex [&>section]:flex-col [&>section]:gap-y-2 [&>section]:w-full",
          "[&>section>input]:text-black"
        )}
        onSubmit={handleSubmit}
      >
        <section>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            onChange={(e) => setName(e.target.value)}
            value={name}
            placeholder="Your name"
            required
          />
        </section>
        <section>
          <label htmlFor="email">EmailObject</label>
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
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            value={message}
            name="message"
            rows={10}
            className={clsx(
              { "outline-red-500": isMaxMessageReach },
              "text-black"
            )}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Your message"
            required
          />
          <span className={clsx({ "text-red-500": isMaxMessageReach })}>
            Max length: {message.length}/{maxMessageLength}
          </span>
        </section>
        <section>
          <button
            className="btn btn-secondary"
            disabled={isSubmitButtonDisabled}
            type="submit"
          >
            {isPending ? "Sending..." : "Submit"}
          </button>
        </section>
      </form>
    </div>
  );
}
