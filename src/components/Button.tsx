import { Slot } from "radix-ui";
import type { ComponentProps } from "react";
import { cx } from "./cx";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ComponentProps<"button"> {
  /** `primary` une fois par vue ; `secondary` à côté ; `ghost` pour annuler et les actions de ligne ; `danger` dans une confirmation. */
  variant?: ButtonVariant;
  /** `md` (32 px) par défaut ; `sm` (28 px) en barre d'outils ou en ligne ; `lg` (36 px) pour un formulaire isolé. */
  size?: ButtonSize;
  /** Bouton carré à icône seule : `aria-label` obligatoire. */
  icon?: boolean;
  /** Rend l'enfant unique (un lien de routeur, par exemple) avec le style du bouton. */
  asChild?: boolean;
}

export function buttonClass({
  variant = "secondary",
  size = "md",
  icon = false,
  className,
}: Pick<ButtonProps, "variant" | "size" | "icon" | "className"> = {}): string {
  return cx(
    "zn-btn",
    `zn-btn-${variant}`,
    size !== "md" && `zn-btn-${size}`,
    icon && "zn-btn-icon",
    className,
  );
}

export function Button({ variant, size, icon, asChild = false, className, type, ...props }: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";
  return (
    <Comp
      className={buttonClass({ variant, size, icon, className })}
      type={asChild ? undefined : (type ?? "button")}
      {...props}
    />
  );
}
