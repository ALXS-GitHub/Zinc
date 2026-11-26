import { Tabs as TabsPrimitive } from "radix-ui";
import type { ComponentProps, ReactNode } from "react";
import { cx } from "./cx";

/**
 * Onglets segmentés : changer de vue sur les mêmes données (Tous / Actifs,
 * Liste / Kanban). Pas pour naviguer entre pages. Trois à cinq onglets au plus.
 */
export const Tabs = TabsPrimitive.Root;

export function TabsList({ className, ...props }: ComponentProps<typeof TabsPrimitive.List>) {
  return <TabsPrimitive.List className={cx("zn-tabs-list", className)} {...props} />;
}

export interface TabsTriggerProps extends ComponentProps<typeof TabsPrimitive.Trigger> {
  /** Compteur optionnel, en `text-faint` après le libellé. */
  count?: ReactNode;
}

export function TabsTrigger({ className, count, children, ...props }: TabsTriggerProps) {
  return (
    <TabsPrimitive.Trigger className={cx("zn-tab", className)} {...props}>
      {children}
      {count != null ? <span className="zn-count">{count}</span> : null}
    </TabsPrimitive.Trigger>
  );
}

export const TabsContent = TabsPrimitive.Content;
