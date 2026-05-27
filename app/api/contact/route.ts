import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  subject: z.string().min(4).max(200),
  message: z.string().min(20).max(5000),
});

// Simple in-memory rate limit (1 request per 60s per IP)
const rateLimitMap = new Map<string, number>();

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const now = Date.now();
  const last = rateLimitMap.get(ip) ?? 0;

  if (now - last < 60_000) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a minute." },
      { status: 429 }
    );
  }
  rateLimitMap.set(ip, now);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  // In Phase 2, forward to Resend / save to DB
  console.log("[Contact form]", parsed.data);

  return NextResponse.json({ success: true });
}
