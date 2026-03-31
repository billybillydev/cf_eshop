import { verify } from "hono/jwt";
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
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const contextValue = useMemo(() => ({ token, setToken }), [token]);

  useEffect(() => {
    (async () => {
      if (token) {
        try {
          await verify(token, import.meta.env.VITE_JWT_SECRET);
          localStorage.setItem("token", token);
        } catch (e) {
          // console.error(e);
          localStorage.removeItem("token");
          setToken("");
        }
      } else {
        localStorage.removeItem("token");
      }
    })();
  }, [token]);

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
