import { Search as SearchIcon } from "lucide-react";
import { type ComponentProps, useEffect, useRef } from "react";
import { cx } from "./cx";
import { Kbd } from "./Kbd";

export interface SearchProps extends Omit<ComponentProps<"input">, "type"> {
  /**
   * Touche qui, avec Ctrl (⌘ sur macOS), place le focus dans la recherche.
   * Le raccourci est affiché à droite. Ex. `"k"` → « Ctrl K ».
   */
  hotkey?: string;
  /** Classe du conteneur pilule. */
  containerClassName?: string;
}

const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);

/**
 * Recherche principale — exception assumée : pilule `radius-full`, `control-lg`.
 * Une seule par vue, en haut du contenu. Libellé accessible : `aria-label` ou `placeholder`.
 */
export function Search({ hotkey, containerClassName, className, ref, ...props }: SearchProps) {
  const inner = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!hotkey) return;
    const key = hotkey.toLowerCase();
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === key) {
        e.preventDefault();
        inner.current?.focus();
        inner.current?.select();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hotkey]);

  return (
    <label className={cx("zn-search", containerClassName)}>
      <SearchIcon aria-hidden strokeWidth={2} />
      <input
        type="search"
        aria-label={props["aria-label"] ?? props.placeholder}
        className={className}
        ref={(node) => {
          inner.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        {...props}
      />
      {hotkey ? <Kbd aria-hidden>{`${isMac ? "⌘" : "Ctrl"} ${hotkey.toUpperCase()}`}</Kbd> : null}
    </label>
  );
}
