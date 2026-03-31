"use client";

import { verify } from "hono/jwt";
import { TOKEN_COOKIE_NAME } from "$config/auth";
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";

type AuthContextProps = {
  token: string;
  setToken: Dispatch<SetStateAction<string>>;
};

export const AuthContext = createContext<AuthContextProps>({
  token: "",
  setToken: () => {},
});

export const AuthContextProvider = ({ children }: PropsWithChildren) => {
  const [token, setToken] = useState("");

  useEffect(() => {
    const value = document.cookie
      .split(";")
      .map((v) => v.trim())
      .find((v) => v.startsWith(`${TOKEN_COOKIE_NAME}=`))
      ?.split("=")[1];
    setToken(value ? decodeURIComponent(value) : "");
  }, []);

  const contextValue = useMemo(() => ({ token, setToken }), [token]);

  useEffect(() => {
    (async () => {
      if (token) {
        try {
          const secret = process.env.NEXT_PUBLIC_JWT_SECRET;
          if (secret) {
            await verify(token, secret);
          }
          document.cookie = `${TOKEN_COOKIE_NAME}=${encodeURIComponent(
            token
          )}; path=/; samesite=lax`;
        } catch (e) {
          document.cookie = `${TOKEN_COOKIE_NAME}=; path=/; max-age=0; samesite=lax`;
          setToken("");
        }
      } else {
        document.cookie = `${TOKEN_COOKIE_NAME}=; path=/; max-age=0; samesite=lax`;
      }
    })();
  }, [token]);

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
