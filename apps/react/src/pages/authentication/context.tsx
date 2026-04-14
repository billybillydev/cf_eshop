import { SanitizedCustomerEntity } from "@eshop/business/domain/entities";
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
import z from "zod";

type AuthContextProps = {
  token: string;
  setToken: Dispatch<SetStateAction<string>>;
  user: SanitizedCustomerEntity | null;
};

const sanitizedCustomerSchema = z.object({
  id: z.number(),
  email: z.string(),
  username: z.string(),
  firstname: z.string(),
  // lastName: z.string(),
  createdAt: z.number(),
  updatedAt: z.number(),
  orders: z.array(z.any()),
  favorites: z.array(z.any()),
});

export const AuthContext = createContext<AuthContextProps>({
  token: "",
  setToken: () => {},
  user: null,
});

export const AuthContextProvider = ({ children }: PropsWithChildren) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState<SanitizedCustomerEntity | null>(null);

  const contextValue = useMemo(
    () => ({ token, setToken, user }),
    [token, user]
  );

  useEffect(() => {
    (async () => {
      if (token) {
        try {
          const payload = await verify(
            token,
            import.meta.env.VITE_JWT_SECRET,
            "HS256"
          );
          localStorage.setItem("token", token);

          const parsed = sanitizedCustomerSchema.safeParse(payload.user);
          if (parsed.success) {
            setUser(new SanitizedCustomerEntity(parsed.data));
          }
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
