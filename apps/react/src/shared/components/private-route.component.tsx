import { useAuth } from "$pages/authentication/hooks";
import {
    Navigate,
    Outlet
} from "react-router-dom";

export function PrivateRoute() {
  const { token } = useAuth();

  return token ? <Outlet /> : <Navigate to="/login" />;
}
