import { useAuth } from "$/pages/authentication/hooks";
import {
    Navigate,
    Outlet
} from "react-router-dom";

export function AuthRedirectRoute() {
  const { token } = useAuth();

  return token ? <Navigate to="/" /> : <Outlet />;
}
