"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="grid min-h-[80svh] place-items-center px-4 pt-16 text-center">
      <div>
        <p className="font-mono text-sm text-violet">500 · something broke</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">Something went wrong.</h1>
        <p className="mt-3 text-muted">An unexpected error occurred while rendering this page.</p>
        <button onClick={reset} className="mt-8 rounded-full bg-fg px-5 py-2.5 text-sm font-medium text-bg">
          Try again
        </button>
      </div>
    </div>
  );
}
