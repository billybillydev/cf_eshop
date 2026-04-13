
import { AuthContextProvider } from "$/pages/authentication/context";
import { LoginPage } from "$/pages/authentication/login/index.page";
import { RegisterPage } from "$/pages/authentication/register/index.page";
import { CartContextProvider } from "$/pages/cart/context";
import { CartPage } from "$/pages/cart/index.page";
import { CheckoutPage } from "$/pages/checkout/index.page";
import { ContactPage } from "$/pages/contact/index.page";
import { NotFoundPage } from "$/pages/not-found/index.page";
import { ProductCodePage } from "$/pages/products/code.page";
import { ProductsPage } from "$/pages/products/index.page";
import { AuthRedirectRoute } from "$/shared/components/auth-redirect-route.component";
import { Footer } from "$/shared/components/footer.component";
import { Header } from "$/shared/components/header.component";
import { PrivateRoute } from "$/shared/components/private-route.component";
import { Route, BrowserRouter as Router, Routes, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";

function AppContent() {
  const location = useLocation();
  const isCheckoutRoute = location.pathname.startsWith("/checkout");

  return (
    <AuthContextProvider>
      <CartContextProvider>
        {!isCheckoutRoute ? <Header /> : null}
        <main className="flex-1 relative">
          <Routes>
            <Route element={<PrivateRoute />}>
            </Route>
            <Route path="/cart" Component={CartPage} />
            <Route path="/checkout" Component={CheckoutPage} />
            <Route path="/" Component={ProductsPage} />
            <Route path="/products/:code" Component={ProductCodePage} />
            <Route path="/contact" Component={ContactPage} />
            <Route element={<AuthRedirectRoute />}>
              <Route path="/login" Component={LoginPage} />
              <Route path="/register" Component={RegisterPage} />
            </Route>
            <Route path="*" Component={NotFoundPage} />
          </Routes>
        </main>
        {!isCheckoutRoute ? <Footer /> : null}
        <ToastContainer />
      </CartContextProvider>
    </AuthContextProvider>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
