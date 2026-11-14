export function Disclaimer({ className = "" }: { className?: string }) {
  return (
    <p
      className={`rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200 ${className}`}
    >
      <strong>Prototype — illustrative data.</strong> This is a student prototype using
      clearly-labelled synthetic and public seed data. It is best-effort and
      community-verified, is <strong>not a substitute for official venue information</strong>, and
      is <strong>not endorsed, funded or procured by Council</strong>. In an emergency call 000.
    </p>
  );
}
