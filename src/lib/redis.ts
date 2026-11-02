import { Redis } from "@upstash/redis";

/** Shared Upstash Redis client (HTTP/REST — safe on serverless). Null when env vars are missing. */
export const redis: Redis | null =
  process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN
    ? new Redis({ url: process.env.KV_REST_API_URL, token: process.env.KV_REST_API_TOKEN })
    : null;
