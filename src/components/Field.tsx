import { type ComponentProps, type ReactNode, cloneElement, isValidElement, useId } from "react";
import { cx } from "./cx";

export interface FieldProps extends Omit<ComponentProps<"div">, "children"> {
  label: ReactNode;
  /** Aide sous le champ (`caption`, `text-muted`). */
  help?: ReactNode;
  /** Message d'erreur : remplace l'aide et marque le contrôle `aria-invalid`. */
  error?: ReactNode;
  /** Un seul contrôle (Input, Textarea, SelectTrigger…). Reçoit `id`, `aria-describedby`, `aria-invalid`. */
  children: ReactNode;
}

/** Libellé au-dessus, contrôle, aide ou erreur dessous. Relie les trois pour les lecteurs d'écran. */
export function Field({ label, help, error, children, className, ...props }: FieldProps) {
  const id = useId();
  const noteId = `${id}-note`;
  const note = error ?? help;
  const control = isValidElement<Record<string, unknown>>(children)
    ? cloneElement(children, {
        id: (children.props.id as string | undefined) ?? id,
        "aria-describedby": note ? noteId : undefined,
        "aria-invalid": error ? true : undefined,
      })
    : children;
  const controlId = isValidElement<Record<string, unknown>>(children)
    ? ((children.props.id as string | undefined) ?? id)
    : undefined;
  return (
    <div className={cx("zn-field", className)} {...props}>
      <label className="zn-field-label" htmlFor={controlId}>
        {label}
      </label>
      {control}
      {note ? (
        <span id={noteId} className={error ? "zn-field-error" : "zn-field-help"}>
          {note}
        </span>
      ) : null}
    </div>
  );
}

/** Champ texte. Reste en `sans`, même pour un chemin. */
export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cx("zn-input", className)} {...props} />;
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea className={cx("zn-input", className)} {...props} />;
}
