import { notFound } from "next/navigation";
import { events, getPlan } from "@/lib/data/seed";
import { PARRAMATTA_EVENTS } from "@/lib/events";
import { OrganiserView } from "@/components/OrganiserView";

export function generateStaticParams() {
  const ids = new Set<string>([...events.map((e) => e.id), ...PARRAMATTA_EVENTS.map((e) => e.id)]);
  return [...ids].map((eventId) => ({ eventId }));
}

export async function generateMetadata(props: PageProps<"/organiser/[eventId]">) {
  const { eventId } = await props.params;
  const plan = getPlan(eventId);
  return { title: plan ? `Organiser — ${plan.event.title}` : "Organiser" };
}

export default async function OrganiserPage(props: PageProps<"/organiser/[eventId]">) {
  const { eventId } = await props.params;
  const plan = getPlan(eventId);
  if (!plan) notFound();
  return <OrganiserView plan={plan} />;
}
