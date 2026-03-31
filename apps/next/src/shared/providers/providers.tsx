"use client";

import { AuthContextProvider } from "$pages/authentication/context";
import { CartContextProvider } from "$pages/cart/context";
import { PropsWithChildren } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function Providers({ children }: PropsWithChildren) {
  return (
    <AuthContextProvider>
      <CartContextProvider>
        {children}
        <ToastContainer />
      </CartContextProvider>
    </AuthContextProvider>
  );
}
