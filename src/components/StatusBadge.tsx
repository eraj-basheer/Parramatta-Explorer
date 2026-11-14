import { STATUS_META, statusStyle } from "@/lib/status";
import type { VerificationStatus } from "@/lib/types";

export function StatusBadge({
  status,
  className = "",
}: {
  status: VerificationStatus;
  className?: string;
}) {
  const meta = STATUS_META[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${className}`}
      style={statusStyle(status)}
      title={meta.description}
    >
      <span aria-hidden="true" className="text-[0.7em]">
        ●
      </span>
      {meta.label}
    </span>
  );
}
