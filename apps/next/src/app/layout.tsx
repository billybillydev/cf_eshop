import "./globals.css";

import { Footer } from "$shared/components/footer.component";
import { Header } from "$shared/components/header.component";
import { Providers } from "$shared/providers/providers";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "eShop",
  description: "eShop",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="h-full bg-background text-foreground min-h-dvh flex flex-col">
        <Providers>
          <Header />
          <main className="flex-1 relative">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
