import type { ComponentProps } from "react";
import { cx } from "./cx";

export type ChipStatus = "open" | "progress" | "done" | "blocked" | "neutral";

export interface ChipProps extends ComponentProps<"span"> {
  /** `open` (info), `progress` (warning), `done` (success), `blocked` (danger), `neutral`. Le mot porte le sens ; le point le confirme. */
  status?: ChipStatus;
}

/** Chip de statut — exception assumée : pilule avec point de couleur. Toujours avec un libellé. */
export function Chip({ status = "neutral", className, ...props }: ChipProps) {
  return <span className={cx("zn-chip", status !== "neutral" && `zn-chip-${status}`, className)} {...props} />;
}

/** Tag de classement : `radius-xs`, fond `surface-muted`, sans point. Il classe, il ne signale rien. */
export function Tag({ className, ...props }: ComponentProps<"span">) {
  return <span className={cx("zn-tag", className)} {...props} />;
}
