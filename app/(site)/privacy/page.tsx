import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Ink & Ideas collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <Container narrow className="py-16">
      <div className="prose prose-base dark:prose-invert max-w-none">
        <h1>Privacy Policy</h1>
        <p className="lead text-muted">Last updated: January 2025</p>

        <h2>Information We Collect</h2>
        <p>
          We collect information you provide directly to us, such as when you subscribe to our
          newsletter or contact us. This may include your name and email address.
        </p>
        <p>
          We also collect usage data automatically, including pages visited, time spent, and
          browser/device information via analytics tools (Google Analytics).
        </p>

        <h2>How We Use Your Information</h2>
        <ul>
          <li>To send newsletters and updates you&apos;ve opted into</li>
          <li>To respond to inquiries and provide support</li>
          <li>To understand how people use our site and improve our content</li>
          <li>To comply with legal obligations</li>
        </ul>

        <h2>Cookies</h2>
        <p>
          We use essential cookies to remember your theme preference (dark/light mode). Analytics
          cookies are set by Google Analytics. You can disable non-essential cookies in your browser
          settings at any time.
        </p>

        <h2>Third-Party Services</h2>
        <p>
          We use the following third-party services which have their own privacy policies: Google
          Analytics (analytics), Cloudinary (image hosting), and Resend (email delivery).
        </p>

        <h2>Data Retention</h2>
        <p>
          Newsletter subscriber data is retained until you unsubscribe. Contact form submissions are
          retained for 12 months. Analytics data is retained per Google&apos;s standard retention periods.
        </p>

        <h2>Your Rights</h2>
        <p>
          You have the right to access, correct, or delete your personal data. To exercise these
          rights, contact us at <a href="mailto:hello@lumen.blog">hello@lumen.blog</a>.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about this policy? Email us at{" "}
          <a href="mailto:hello@lumen.blog">hello@lumen.blog</a>.
        </p>
      </div>
    </Container>
  );
}
