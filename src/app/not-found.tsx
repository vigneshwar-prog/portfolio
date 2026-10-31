import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid-bg grid min-h-[80svh] place-items-center px-4 pt-16">
      <div className="text-center">
        <p className="font-mono text-sm text-green">HTTP 404 · route not found</p>
        <h1 className="mt-4 font-serif text-7xl italic sm:text-8xl">Lost packet.</h1>
        <p className="mx-auto mt-5 max-w-md text-muted">
          This page doesn&apos;t exist — it may have moved, or the link was mistyped.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/" className="rounded-full bg-fg px-5 py-2.5 text-sm font-medium text-bg">Back home</Link>
          <Link href="/#projects" className="rounded-full border border-line-strong px-5 py-2.5 text-sm">See projects</Link>
        </div>
      </div>
    </div>
  );
}
