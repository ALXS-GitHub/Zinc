/**
 * Composants shadcn/ui (new-york, Tailwind v4) recopiés tels quels, sans
 * aucune retouche de style : ils servent à vérifier que la couche
 * `@zinc/ui/shadcn.css` leur donne l'allure Zinc.
 */
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";
import type { ComponentProps } from "react";
import { cx as cn } from "../../src/components/cx";

const buttonBase =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]";
const buttonVariants = {
  default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
  destructive: "bg-destructive text-white shadow-xs hover:bg-destructive/90",
  outline:
    "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
  secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
  ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
  link: "text-primary underline-offset-4 hover:underline",
} as const;

export function ShButton({
  variant = "default",
  className,
  ...props
}: ComponentProps<"button"> & { variant?: keyof typeof buttonVariants }) {
  return <button type="button" className={cn(buttonBase, buttonVariants[variant], "h-9 px-4 py-2", className)} {...props} />;
}

export function ShInput({ className, ...props }: ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        className,
      )}
      {...props}
    />
  );
}

export function ShBadge({
  variant = "default",
  className,
  ...props
}: ComponentProps<"span"> & { variant?: "default" | "secondary" | "outline" }) {
  const v = {
    default: "border-transparent bg-primary text-primary-foreground",
    secondary: "border-transparent bg-secondary text-secondary-foreground",
    outline: "text-foreground",
  }[variant];
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 gap-1",
        v,
        className,
      )}
      {...props}
    />
  );
}

export function ShCard({ className, ...props }: ComponentProps<"div">) {
  return (
    <div className={cn("bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm", className)} {...props} />
  );
}

export function ShCardHeader({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("grid auto-rows-min items-start gap-1.5 px-6", className)} {...props} />;
}

export function ShCardTitle({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("leading-none font-semibold", className)} {...props} />;
}

export function ShCardDescription({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("text-muted-foreground text-sm", className)} {...props} />;
}

export function ShCardContent({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("px-6", className)} {...props} />;
}

export const ShDropdownMenu = DropdownMenuPrimitive.Root;
export const ShDropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

export function ShDropdownMenuContent({ className, sideOffset = 4, ...props }: ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        sideOffset={sideOffset}
        className={cn("bg-popover text-popover-foreground z-50 min-w-[8rem] overflow-hidden rounded-md border p-1 shadow-md", className)}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
}

export function ShDropdownMenuItem({ className, ...props }: ComponentProps<typeof DropdownMenuPrimitive.Item>) {
  return (
    <DropdownMenuPrimitive.Item
      className={cn(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
