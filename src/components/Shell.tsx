import { Slot } from "radix-ui";
import type { ComponentProps, ReactNode } from "react";
import { cx } from "./cx";

export interface ShellProps extends ComponentProps<"div"> {
  /** Coquille encadrée (planche, aperçu) au lieu du plein écran. */
  framed?: boolean;
}

/**
 * Coquille d'app, style Panneau : nav posée sur `bg`, contenu dans un panneau
 * `surface` surélevé, à `shell-gap` de la fenêtre et de la nav. Enfants : une
 * `Sidebar` puis un `Panel`. Ce que contient le panneau (sa disposition) est libre.
 */
export function Shell({ framed = false, className, ...props }: ShellProps) {
  return <div className={cx("zn-shell", framed && "is-framed", className)} {...props} />;
}

export function Sidebar({ className, "aria-label": ariaLabel = "Navigation principale", ...props }: ComponentProps<"nav">) {
  return <nav className={cx("zn-sidebar", className)} aria-label={ariaLabel} {...props} />;
}

export interface SidebarBrandProps extends ComponentProps<"div"> {
  /** Marque de l'app (logo ou carré d'accent par défaut). */
  mark?: ReactNode;
}

/** Nom de l'app, en police `display`. */
export function SidebarBrand({ mark, className, children, ...props }: SidebarBrandProps) {
  return (
    <div className={cx("zn-brand", className)} {...props}>
      {mark ?? <span className="zn-brand-mark" aria-hidden />}
      {children}
    </div>
  );
}

/** Titre de groupe dans la nav : capitales, `text-faint`. */
export function SidebarGroupLabel({ className, ...props }: ComponentProps<"div">) {
  return <div className={cx("zn-eyebrow", className)} {...props} />;
}

/** Bas de la nav (réglages, compte), poussé en bas. */
export function SidebarFooter({ className, ...props }: ComponentProps<"div">) {
  return <div className={cx("zn-sidebar-foot", className)} {...props} />;
}

export interface NavItemProps extends ComponentProps<"a"> {
  /** Icône Lucide 16 px ; passe en `accent-text` quand l'item est actif. */
  icon?: ReactNode;
  /** Compteur à droite. */
  count?: ReactNode;
  /** Page courante : petite carte `surface` + `border` + `shadow-sm`. Pose `aria-current="page"`. */
  active?: boolean;
  /** Rend l'enfant unique (le `Link` du routeur) avec le style de l'item. */
  asChild?: boolean;
}

export function NavItem({ icon, count, active = false, asChild = false, className, children, ...props }: NavItemProps) {
  const Comp = asChild ? Slot.Root : "a";
  return (
    <Comp className={cx("zn-nav", className)} aria-current={active ? "page" : undefined} {...props}>
      {asChild ? (
        children
      ) : (
        <>
          {icon}
          {children}
          {count != null ? <span className="zn-count">{count}</span> : null}
        </>
      )}
    </Comp>
  );
}

/** Panneau de contenu : `surface`, `border`, `shadow-sm`, `radius-lg`. Défile seul. */
export function Panel({ className, ...props }: ComponentProps<"main">) {
  return <main className={cx("zn-panel", className)} {...props} />;
}

export interface PageHeaderProps extends Omit<ComponentProps<"header">, "title"> {
  /** Titre de page (`display`), une fois par vue. */
  title: ReactNode;
  /** Actions à droite (un seul bouton `primary`). */
  actions?: ReactNode;
}

export function PageHeader({ title, actions, className, children, ...props }: PageHeaderProps) {
  return (
    <header className={cx("zn-page-head", className)} {...props}>
      <h1 className="zn-page-title">{title}</h1>
      {children}
      {actions ? (
        <>
          <span className="zn-spacer" aria-hidden />
          {actions}
        </>
      ) : null}
    </header>
  );
}
