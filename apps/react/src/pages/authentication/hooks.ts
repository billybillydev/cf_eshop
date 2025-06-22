import { AuthContext } from "$pages/authentication/context";
import { useContext } from "react";

export const useAuth = () => useContext(AuthContext);
