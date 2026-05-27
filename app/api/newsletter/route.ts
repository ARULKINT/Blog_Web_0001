import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email" }, { status: 422 });
  }

  const { email } = parsed.data;
  const apiKey = process.env.RESEND_API_KEY;

  if (apiKey) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(apiKey);

      await resend.emails.send({
        from: `${process.env.NEXT_PUBLIC_SITE_NAME ?? "Blog"} <onboarding@resend.dev>`,
        to: email,
        subject: "You're subscribed!",
        html: `<p>Thanks for subscribing to ${process.env.NEXT_PUBLIC_SITE_NAME ?? "our blog"}. You'll hear from us soon.</p>`,
      });
    } catch {
      // Log but don't fail the request — subscriber still recorded
      console.error("[newsletter] Resend error");
    }
  }

  return NextResponse.json({ ok: true });
}
