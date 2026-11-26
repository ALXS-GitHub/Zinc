import type { ComponentProps } from "react";
import { cx } from "./cx";

/** Raccourci clavier, en `mono`. */
export function Kbd({ className, ...props }: ComponentProps<"kbd">) {
  return <kbd className={cx("zn-kbd", className)} {...props} />;
}
