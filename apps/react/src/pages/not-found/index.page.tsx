import { Button } from "$/shared/components/button.component";

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-col items-center justify-center gap-y-6">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          404 - Page Not Found
        </h1>
        <p>The page you are looking for does not exist.</p>
        <div>
          <a href="/">
            <Button text="Go back to home" />
          </a>
        </div>
      </div>
    </div>
  );
}
