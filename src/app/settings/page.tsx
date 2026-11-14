import { SettingsControls } from "@/components/SettingsControls";
import { SpeakButton } from "@/components/SpeakButton";

export const metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-display text-3xl font-bold">Settings</h1>
          <SpeakButton />
        </div>
        <p style={{ color: "var(--page-fg-soft)" }}>
          Adjust the display to suit your needs. Your choices are saved on this device only.
        </p>
      </header>

      <SettingsControls />

      <section className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="font-display text-xl font-bold">Why these options</h2>
          <SpeakButton
            label="Listen to this section"
            text="Why these options. Theme switches between light and dark for comfort and low light. Colour mode offers palettes that stay distinguishable for the most common types of colour blindness, and a high contrast monochrome mode. Text size scales the whole interface up to 137 percent. No colour is ever the only signal: every status also has a text label."
          />
        </div>
        <ul className="list-disc space-y-1 pl-5" style={{ color: "var(--page-fg-soft)" }}>
          <li>
            <strong>Theme</strong> — light or dark, for comfort in bright or low light.
          </li>
          <li>
            <strong>Colour mode</strong> — palettes tuned for protanopia, deuteranopia and
            tritanopia, plus a high-contrast monochrome option. Status is always paired with a text
            label, so colour is never the only signal.
          </li>
          <li>
            <strong>Text size</strong> — scales the whole interface, not just body text.
          </li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-xl font-bold">Text to speech</h2>
        <p style={{ color: "var(--page-fg-soft)" }}>
          Every page and every section has a <strong>Listen</strong> button. It uses your browser or
          device voice, so no audio is sent to us. If your browser does not support it, the button
          is hidden automatically.
        </p>
      </section>
    </div>
  );
}
