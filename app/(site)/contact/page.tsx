"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Mail, MessageSquare, Send, Loader2, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  subject: z.string().min(4, "Subject must be at least 4 characters"),
  message: z.string().min(20, "Message must be at least 20 characters"),
});

type FormData = z.infer<typeof schema>;

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <Container className="py-16 max-w-2xl">
      <div className="text-center mb-12">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent mb-4">
          <Mail className="h-5 w-5" />
        </div>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-text mb-3">
          Get in touch
        </h1>
        <p className="text-muted text-base leading-relaxed">
          Have a question, a pitch, or just want to say hi? Drop us a message and we&apos;ll get back to you within 48 hours.
        </p>
      </div>

      {status === "success" ? (
        <div className="text-center py-16 bg-surface border border-border rounded-3xl">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h2 className="font-serif text-xl font-semibold text-text mb-2">Message sent!</h2>
          <p className="text-muted text-sm">We&apos;ll get back to you soon.</p>
          <Button
            variant="ghost"
            className="mt-6"
            onClick={() => setStatus("idle")}
          >
            Send another
          </Button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-surface border border-border rounded-3xl p-8 shadow-card space-y-5"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              label="Name"
              placeholder="Your name"
              error={errors.name?.message}
              {...register("name")}
            />
            <Input
              type="email"
              label="Email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register("email")}
            />
          </div>

          <Input
            label="Subject"
            placeholder="What is this about?"
            error={errors.subject?.message}
            {...register("subject")}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text">Message</label>
            <textarea
              rows={5}
              placeholder="Your message…"
              className={cn(
                "w-full rounded-xl border border-border bg-surface px-3.5 py-3 text-sm text-text placeholder:text-muted",
                "focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20",
                "resize-none transition-colors",
                errors.message && "border-red-400 focus:border-red-400"
              )}
              {...register("message")}
            />
            {errors.message && (
              <p className="text-xs text-red-500">{errors.message.message}</p>
            )}
          </div>

          {status === "error" && (
            <p className="text-sm text-red-500">
              Something went wrong. Please try again.
            </p>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={status === "loading"}
            className="w-full"
          >
            {status === "loading" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Send className="h-4 w-4" />
                Send message
              </>
            )}
          </Button>
        </form>
      )}

      {/* Contact info */}
      <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-accent" />
          <span>hello@lumen.blog</span>
        </div>
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-accent" />
          <span>Usually replies within 48h</span>
        </div>
      </div>
    </Container>
  );
}
