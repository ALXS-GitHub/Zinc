import { Check, Minus } from "lucide-react";
import { Checkbox as CheckboxPrimitive, Switch as SwitchPrimitive } from "radix-ui";
import type { ComponentProps, ReactNode } from "react";
import { cx } from "./cx";

export interface SwitchProps extends ComponentProps<typeof SwitchPrimitive.Root> {
  /** Libellé cliquable à droite. Sans libellé, fournir `aria-label`. */
  label?: ReactNode;
}

/** Interrupteur : effet immédiat. Éteint : contour `border-control` ; allumé : aplat `accent`. */
export function Switch({ label, className, ...props }: SwitchProps) {
  const control = (
    <SwitchPrimitive.Root className={cx("zn-switch", className)} {...props}>
      <SwitchPrimitive.Thumb className="zn-switch-thumb" />
    </SwitchPrimitive.Root>
  );
  return label ? (
    <label className="zn-check">
      {control}
      {label}
    </label>
  ) : (
    control
  );
}

export interface CheckboxProps extends ComponentProps<typeof CheckboxPrimitive.Root> {
  /** Libellé cliquable à droite. Sans libellé, fournir `aria-label`. */
  label?: ReactNode;
}

/** Case à cocher : `radius-xs`, cochée en aplat `accent`, coche en `on-accent`. Gère l'état indéterminé. */
export function Checkbox({ label, className, ...props }: CheckboxProps) {
  const control = (
    <CheckboxPrimitive.Root className={cx("zn-checkbox", className)} {...props}>
      <CheckboxPrimitive.Indicator asChild>
        {props.checked === "indeterminate" ? (
          <Minus aria-hidden strokeWidth={3} />
        ) : (
          <Check aria-hidden strokeWidth={3} />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
  return label ? (
    <label className="zn-check">
      {control}
      {label}
    </label>
  ) : (
    control
  );
}
