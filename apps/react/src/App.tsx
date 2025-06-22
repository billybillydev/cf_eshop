import { AuthContextProvider } from "$pages/authentication/context";
import { LoginPage } from "$pages/authentication/login/index.page";
import { RegisterPage } from "$pages/authentication/register/index.page";
import { CartContextProvider } from "$pages/cart/context";
import { CartPage } from "$pages/cart/index.page";
import { ContactPage } from "$pages/contact/index.page";
import { ProductCodePage } from "$pages/products/code.page";
import { ProductsPage } from "$pages/products/index.page";
import { AuthRedirectRoute } from "$shared/components/auth-redirect-route.component";
import { Footer } from "$shared/components/footer.component";
import { Header } from "$shared/components/header.component";
import { PrivateRoute } from "$shared/components/private-route.component";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <Router>
      <AuthContextProvider>
        <CartContextProvider>
          <Header />
          <main className="content relative">
            <Routes>
              <Route element={<PrivateRoute />}>
                <Route path="/cart" Component={CartPage} />
                <Route path="/" Component={ProductsPage} />
                <Route path="/:code" Component={ProductCodePage} />
              </Route>
              <Route path="/contact" Component={ContactPage} />
              <Route element={<AuthRedirectRoute />}>
                <Route path="/login" Component={LoginPage} />
                <Route path="/register" Component={RegisterPage} />
              </Route>
            </Routes>
          </main>
          <Footer />
          <ToastContainer />
        </CartContextProvider>
      </AuthContextProvider>
    </Router>
  );
}

export default App;
