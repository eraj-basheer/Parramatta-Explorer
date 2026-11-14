import { Suspense } from "react";
import { notFound } from "next/navigation";
import { events, getPlan } from "@/lib/data/seed";
import { PARRAMATTA_EVENTS } from "@/lib/events";
import { PlanView } from "@/components/PlanView";

export function generateStaticParams() {
  const ids = new Set<string>([...events.map((e) => e.id), ...PARRAMATTA_EVENTS.map((e) => e.id)]);
  return [...ids].map((eventId) => ({ eventId }));
}

export async function generateMetadata(props: PageProps<"/plan/[eventId]">) {
  const { eventId } = await props.params;
  const plan = getPlan(eventId);
  return { title: plan ? `Access plan — ${plan.event.title}` : "Access plan" };
}

export default async function PlanPage(props: PageProps<"/plan/[eventId]">) {
  const { eventId } = await props.params;
  const plan = getPlan(eventId);
  if (!plan) notFound();
  return (
    <Suspense fallback={<p style={{ color: "var(--page-fg-soft)" }}>Loading plan…</p>}>
      <PlanView plan={plan} />
    </Suspense>
  );
}
