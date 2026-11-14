import { Suspense } from "react";
import { ReportBoard } from "@/components/ReportBoard";
import { SpeakButton } from "@/components/SpeakButton";

export const metadata = { title: "Report a problem" };

async function ReportWithParams({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const event = typeof sp.event === "string" ? sp.event : undefined;
  const feature = typeof sp.feature === "string" ? sp.feature : undefined;
  return <ReportBoard initialEventId={event} initialFeatureId={feature} />;
}

export default function ReportPage(props: PageProps<"/report">) {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-display text-3xl font-bold">Report a problem</h1>
          <SpeakButton />
        </div>
        <p style={{ color: "var(--page-fg-soft)" }}>
          Spot something wrong with an access feature? Report it in three steps. There is no
          moderator — other attendees confirm what is true, and abusive or private content is
          filtered automatically.
        </p>
      </header>

      <Suspense fallback={<p style={{ color: "var(--page-fg-soft)" }}>Loading form…</p>}>
        <ReportWithParams searchParams={props.searchParams} />
      </Suspense>
    </div>
  );
}
