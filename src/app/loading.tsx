export default function Loading() {
  return (
    <div className="grid min-h-[80svh] place-items-center" role="status" aria-label="Loading">
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <span key={i} className="size-2 animate-pulse rounded-full bg-green" style={{ animationDelay: `${i * 150}ms` }} />
        ))}
      </div>
    </div>
  );
}
