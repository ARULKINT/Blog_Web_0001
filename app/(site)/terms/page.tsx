import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms of service for using Ink & Ideas.",
};

export default function TermsPage() {
  return (
    <Container narrow className="py-16">
      <div className="prose prose-base dark:prose-invert max-w-none">
        <h1>Terms &amp; Conditions</h1>
        <p className="lead text-muted">Last updated: January 2025</p>

        <h2>Acceptance of Terms</h2>
        <p>
          By accessing and using Ink & Ideas (&ldquo;the Site&rdquo;), you accept and agree to be bound by these
          Terms and Conditions. If you do not agree, please do not use the Site.
        </p>

        <h2>Intellectual Property</h2>
        <p>
          All content published on Ink & Ideas — including articles, images, and design — is the
          intellectual property of Ink & Ideas or its contributors. You may quote up to 300 words with
          clear attribution and a link back to the original article. Full reproduction requires
          written permission.
        </p>

        <h2>User Conduct</h2>
        <p>When using the Site you agree not to:</p>
        <ul>
          <li>Scrape or reproduce content in bulk without permission</li>
          <li>Post spam or malicious content in comments (when enabled)</li>
          <li>Attempt to gain unauthorized access to any part of the Site</li>
          <li>Use the Site in any way that could harm or impair its operation</li>
        </ul>

        <h2>Newsletter</h2>
        <p>
          By subscribing to our newsletter you consent to receive periodic emails. You can
          unsubscribe at any time via the link in any email.
        </p>

        <h2>Disclaimer</h2>
        <p>
          Content on Ink & Ideas is for informational purposes only. We make no warranties about
          accuracy or completeness. We are not liable for any loss or damage arising from your
          use of the content.
        </p>

        <h2>Links to Third Parties</h2>
        <p>
          The Site may contain links to external websites. We are not responsible for the content
          or practices of those sites.
        </p>

        <h2>Changes to Terms</h2>
        <p>
          We may update these Terms at any time. Continued use of the Site after changes constitutes
          acceptance. We will note the &ldquo;Last updated&rdquo; date at the top of this page.
        </p>

        <h2>Contact</h2>
        <p>
          Questions? Email <a href="mailto:hello@lumen.blog">hello@lumen.blog</a>.
        </p>
      </div>
    </Container>
  );
}
