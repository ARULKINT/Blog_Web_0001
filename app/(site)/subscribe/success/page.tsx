import { Container } from "@/components/ui/Container";
import { Check } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function SubscribeSuccessPage() {
  return (
    <Container narrow className="py-20 text-center">
      <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 mb-6">
        <Check className="h-7 w-7" />
      </div>
      <h1 className="font-serif text-3xl font-bold text-text mb-3">
        You&apos;re subscribed!
      </h1>
      <p className="text-muted mb-8">
        Welcome aboard. You now have unlimited access to all premium articles.
      </p>
      <div className="flex items-center justify-center gap-3">
        <Link href="/blog">
          <Button variant="primary">Browse articles</Button>
        </Link>
        <Link href="/profile">
          <Button variant="outline">My profile</Button>
        </Link>
      </div>
    </Container>
  );
}
