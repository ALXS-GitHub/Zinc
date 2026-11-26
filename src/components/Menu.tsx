import { Check } from "lucide-react";
import { DropdownMenu as MenuPrimitive } from "radix-ui";
import type { ComponentProps, ReactNode } from "react";
import { cx } from "./cx";

/** Menu d'actions (Radix DropdownMenu) : `surface`, `border`, `radius-md`, `shadow-pop`. */
export const Menu = MenuPrimitive.Root;
export const MenuTrigger = MenuPrimitive.Trigger;
export const MenuGroup = MenuPrimitive.Group;
export const MenuRadioGroup = MenuPrimitive.RadioGroup;
export const MenuSub = MenuPrimitive.Sub;

export function MenuContent({
  className,
  sideOffset = 4,
  align = "start",
  ...props
}: ComponentProps<typeof MenuPrimitive.Content>) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Content className={cx("zn-menu", className)} sideOffset={sideOffset} align={align} {...props} />
    </MenuPrimitive.Portal>
  );
}

export interface MenuItemProps extends ComponentProps<typeof MenuPrimitive.Item> {
  /** Icône Lucide (16 px) à gauche. */
  icon?: ReactNode;
  /** Raccourci affiché à droite, en `mono`. */
  shortcut?: ReactNode;
  /** Action destructrice : texte et icône en `danger`. */
  danger?: boolean;
}

export function MenuItem({ icon, shortcut, danger, className, children, ...props }: MenuItemProps) {
  return (
    <MenuPrimitive.Item className={cx("zn-menu-item", danger && "is-danger", className)} {...props}>
      {icon}
      {children}
      {shortcut ? <span className="zn-menu-shortcut">{shortcut}</span> : null}
    </MenuPrimitive.Item>
  );
}

export function MenuCheckboxItem({ className, children, ...props }: ComponentProps<typeof MenuPrimitive.CheckboxItem>) {
  return (
    <MenuPrimitive.CheckboxItem className={cx("zn-menu-item", className)} {...props}>
      {children}
      <MenuPrimitive.ItemIndicator className="zn-menu-item-indicator">
        <Check aria-hidden strokeWidth={2} />
      </MenuPrimitive.ItemIndicator>
    </MenuPrimitive.CheckboxItem>
  );
}

export function MenuRadioItem({ className, children, ...props }: ComponentProps<typeof MenuPrimitive.RadioItem>) {
  return (
    <MenuPrimitive.RadioItem className={cx("zn-menu-item", className)} {...props}>
      {children}
      <MenuPrimitive.ItemIndicator className="zn-menu-item-indicator">
        <Check aria-hidden strokeWidth={2} />
      </MenuPrimitive.ItemIndicator>
    </MenuPrimitive.RadioItem>
  );
}

export function MenuLabel({ className, ...props }: ComponentProps<typeof MenuPrimitive.Label>) {
  return <MenuPrimitive.Label className={cx("zn-menu-label", className)} {...props} />;
}

export function MenuSeparator({ className, ...props }: ComponentProps<typeof MenuPrimitive.Separator>) {
  return <MenuPrimitive.Separator className={cx("zn-menu-separator", className)} {...props} />;
}
