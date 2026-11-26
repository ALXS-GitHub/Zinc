import { Slot } from "radix-ui";
import type { ComponentProps } from "react";
import { cx } from "./cx";

export interface CardProps extends ComponentProps<"div"> {
  /** Carte cliquable : au survol, fond `surface` et contour `border-strong`, sans se soulever. */
  interactive?: boolean;
  /** Rend l'enfant unique (un lien, un bouton) avec le style de la carte. */
  asChild?: boolean;
}

/** Carte posée dans le panneau : `surface-subtle`, contour `border`, `radius-md`, sans ombre. */
export function Card({ interactive = false, asChild = false, className, ...props }: CardProps) {
  const Comp = asChild ? Slot.Root : "div";
  return <Comp className={cx("zn-card", interactive && "is-clickable", className)} {...props} />;
}

export function CardHeader({ className, ...props }: ComponentProps<"div">) {
  return <div className={cx("zn-card-head", className)} {...props} />;
}

export function CardTitle({ className, ...props }: ComponentProps<"h3">) {
  return <h3 className={cx("zn-card-title", className)} {...props} />;
}

/** Méta en `mono` : chemin, référence (`ZORG-26`). */
export function CardMeta({ className, ...props }: ComponentProps<"span">) {
  return <span className={cx("zn-card-meta", className)} {...props} />;
}

export function CardDescription({ className, ...props }: ComponentProps<"p">) {
  return <p className={cx("zn-card-desc", className)} {...props} />;
}

export function CardFooter({ className, ...props }: ComponentProps<"div">) {
  return <div className={cx("zn-card-foot", className)} {...props} />;
}

/** Élément extensible qui pousse la suite à droite dans une ligne flex. */
export function Spacer() {
  return <span className="zn-spacer" aria-hidden />;
}
