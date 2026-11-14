import { SignInForm } from "@/components/SignInForm";
import { SpeakButton } from "@/components/SpeakButton";

export const metadata = { title: "Sign in" };

export default function SignInPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-display text-3xl font-bold">Sign in</h1>
          <SpeakButton />
        </div>
        <p style={{ color: "var(--page-fg-soft)" }}>
          Attendees and organisers see different things. Attendees never need an account;
          organisers are verified so published access information can be trusted.
        </p>
      </header>

      <SignInForm />

      <section className="space-y-2">
        <h2 className="font-display text-xl font-bold">How your privacy is protected</h2>
        <ul className="list-disc space-y-1 pl-5" style={{ color: "var(--page-fg-soft)" }}>
          <li>
            <strong>Attendees:</strong> no name, no email, no health or disability information is
            collected or stored. Any need profile you pick is kept only in your browser.
          </li>
          <li>
            <strong>Organisers:</strong> verified by a work-email link or invite code — we never ask
            for identity documents, and we don&apos;t store more than your verified role.
          </li>
          <li>
            This is a prototype. See the{" "}
            <a href="/about" className="underline">
              About &amp; data
            </a>{" "}
            page for the full data approach.
          </li>
        </ul>
      </section>
    </div>
  );
}
