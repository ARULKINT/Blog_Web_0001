"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Save, Check } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const schema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  bio: z.string().max(500).optional(),
  avatar: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  social: z.object({
    twitter: z.string().max(100).optional(),
    github: z.string().max(100).optional(),
    website: z.string().max(200).optional(),
  }),
});

type FormData = z.infer<typeof schema>;

interface ProfileFormProps {
  initial: {
    name: string;
    bio?: string;
    avatar?: string;
    social?: { twitter?: string; github?: string; website?: string };
  };
}

export function ProfileForm({ initial }: ProfileFormProps) {
  const [saved, setSaved] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initial.name,
      bio: initial.bio ?? "",
      avatar: initial.avatar ?? "",
      social: {
        twitter: initial.social?.twitter ?? "",
        github: initial.social?.github ?? "",
        website: initial.social?.website ?? "",
      },
    },
  });

  const onSubmit = async (data: FormData) => {
    setServerError("");
    setSaved(false);
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      const json = await res.json();
      setServerError(json.error ?? "Failed to save");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-xl">
      <Input
        label="Display Name"
        {...register("name")}
        error={errors.name?.message}
      />
      <div>
        <label className="block text-sm font-medium text-text mb-1.5">Bio</label>
        <textarea
          {...register("bio")}
          rows={3}
          placeholder="A short bio about yourself…"
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent resize-none"
        />
        {errors.bio && <p className="mt-1 text-xs text-red-500">{errors.bio.message}</p>}
      </div>
      <Input
        label="Avatar URL"
        {...register("avatar")}
        placeholder="https://example.com/avatar.jpg"
        error={errors.avatar?.message}
      />

      <div className="border-t border-border pt-6">
        <p className="text-sm font-semibold text-text mb-4">Social Links</p>
        <div className="space-y-4">
          <Input
            label="Twitter / X handle"
            {...register("social.twitter")}
            placeholder="@yourhandle"
          />
          <Input
            label="GitHub username"
            {...register("social.github")}
            placeholder="yourusername"
          />
          <Input
            label="Website"
            {...register("social.website")}
            placeholder="https://yoursite.com"
          />
        </div>
      </div>

      {serverError && <p className="text-sm text-red-500">{serverError}</p>}

      <Button type="submit" variant="primary" disabled={isSubmitting} className="gap-2">
        {isSubmitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : saved ? (
          <Check className="h-4 w-4" />
        ) : (
          <Save className="h-4 w-4" />
        )}
        {saved ? "Saved!" : "Save changes"}
      </Button>
    </form>
  );
}
