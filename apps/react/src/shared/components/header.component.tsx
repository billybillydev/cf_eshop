import { useAuth } from "$pages/authentication/hooks";
import { useCartContext } from "$pages/cart/hooks";
import clsx from "clsx";
import { NavLink, redirect } from "react-router-dom";

export function Header() {
  const { token, setToken } = useAuth();
  const { cart } = useCartContext();

  const handleLogout = () => {
    setToken("");

    redirect("/login");
  };

  return (
    <header className="header">
      <nav>
        <ul>
          {token ? (
            <>
              <li>
                <NavLink
                  className={({ isActive }) =>
                    clsx(
                      "menu-link",
                      isActive ? "active-link" : "inactive-link"
                    )
                  }
                  to={"/"}
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  className={({ isActive }) =>
                    clsx(
                      "menu-link gap-x-2",
                      isActive ? "active-link" : "inactive-link"
                    )
                  }
                  to={"/cart"}
                >
                  <span>Cart</span>
                  {cart ? (
                    <span
                      className={clsx(
                        "cart-quantity-container",
                        cart.totalQuantity > 0
                          ? "quantity-non-empty-color"
                          : "quantity-empty-color"
                      )}
                    >
                      {cart.totalQuantity}
                    </span>
                  ) : null}
                </NavLink>
              </li>
            </>
          ) : null}
          <li>
            <NavLink
              className={({ isActive }) =>
                clsx("menu-link", isActive ? "active-link" : "inactive-link")
              }
              to={"/contact"}
            >
              Contact
            </NavLink>
          </li>
          {token ? (
            <button
              className="btn btn-outlined px-4 py-2 rounded"
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : (
            <NavLink
              className={({ isActive }) =>
                clsx("menu-link", isActive ? "active-link" : "inactive-link")
              }
              to={"/login"}
            >
              Login
            </NavLink>
          )}
        </ul>
      </nav>
    </header>
  );
}
