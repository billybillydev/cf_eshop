export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">eShop © {new Date().getFullYear()}</p>
        <a
          href="/contact"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Support
        </a>
      </div>
    </footer>
  );
}
