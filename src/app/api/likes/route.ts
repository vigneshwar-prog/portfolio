import { createHash } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "@/lib/redis";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const COUNT_KEY = "likes:site";
const YEAR = 60 * 60 * 24 * 365;

// Atomic: mark visitor (once) and increment in one round trip.
const LIKE_SCRIPT = `
if redis.call('SET', KEYS[1], 1, 'NX', 'EX', ARGV[1]) then
  return {1, redis.call('INCR', KEYS[2])}
end
return {0, tonumber(redis.call('GET', KEYS[2]) or '0')}
`;

const ratelimit = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5, "1 m"), prefix: "rl:likes" })
  : null;

function ip(req: NextRequest) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

function visitorHash(req: NextRequest) {
  const salt = process.env.LIKE_SALT ?? "";
  return createHash("sha256").update(`${ip(req)}|${req.headers.get("user-agent") ?? ""}|${salt}`).digest("hex");
}

function unavailable() {
  return NextResponse.json({ error: "Likes are not configured" }, { status: 503 });
}

export async function GET() {
  if (!redis) return unavailable();
  const count = Number((await redis.get<number>(COUNT_KEY)) ?? 0);
  return NextResponse.json(
    { count },
    { headers: { "Cache-Control": "public, s-maxage=10, stale-while-revalidate=60" } },
  );
}

export async function POST(req: NextRequest) {
  if (!redis || !ratelimit) return unavailable();

  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (!origin || !host || new URL(origin).host !== host) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { success } = await ratelimit.limit(ip(req));
  if (!success) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const [added, count] = (await redis.eval(LIKE_SCRIPT, [`like:v:${visitorHash(req)}`, COUNT_KEY], [YEAR])) as [
    number,
    number,
  ];

  const res = NextResponse.json({ count: Number(count), liked: true, added: added === 1 });
  res.headers.set("Cache-Control", "no-store");
  res.cookies.set("liked", "1", { httpOnly: true, sameSite: "lax", secure: true, maxAge: YEAR, path: "/" });
  return res;
}
