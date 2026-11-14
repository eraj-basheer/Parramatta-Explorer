"use client";

import { NEED_PROFILES } from "@/lib/needs";
import type { NeedId } from "@/lib/types";

export function NeedSelector({
  selected,
  onChange,
}: {
  selected: NeedId[];
  onChange: (next: NeedId[]) => void;
}) {
  function toggle(id: NeedId) {
    onChange(selected.includes(id) ? selected.filter((n) => n !== id) : [...selected, id]);
  }

  return (
    <fieldset>
      <legend className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        What do you need?{" "}
        <span className="font-normal text-zinc-500 dark:text-zinc-400">(select any)</span>
      </legend>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {NEED_PROFILES.map((need) => {
          const checked = selected.includes(need.id);
          return (
            <label
              key={need.id}
              className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-sm transition-colors ${
                checked
                  ? "border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-950/40"
                  : "border-zinc-300 bg-white hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800"
              }`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggle(need.id)}
                className="mt-0.5 h-5 w-5 shrink-0 accent-blue-600"
              />
              <span>
                <span className="block font-medium text-zinc-900 dark:text-zinc-100">
                  {need.label}
                </span>
                <span className="block text-zinc-500 dark:text-zinc-400">
                  {need.description}
                </span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
