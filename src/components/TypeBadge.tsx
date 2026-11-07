import { typeClass } from "../lib/pokedex";

export function TypeBadge({ name }: { name: string }) {
  return (
    <span
      className={`${typeClass(name)} bg-type rounded-full px-3 py-0.5 text-xs font-bold uppercase tracking-wide text-background`}
    >
      {name}
    </span>
  );
}
