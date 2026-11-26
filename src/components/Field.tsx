import { type ComponentProps, type ReactNode, createContext, useContext, useId } from "react";
import { cx } from "./cx";

interface FieldContextValue {
  id: string;
  noteId: string | undefined;
  invalid: boolean;
}

const FieldContext = createContext<FieldContextValue | null>(null);

/**
 * Attributs d'accessibilité d'un contrôle placé dans un `Field` : `id` (cible
 * du libellé), `aria-describedby` (aide ou erreur), `aria-invalid`. Les props
 * explicites du contrôle gardent la priorité.
 */
export function useFieldControl<P extends { id?: string; "aria-describedby"?: string; "aria-invalid"?: unknown }>(
  props: P,
): P {
  const field = useContext(FieldContext);
  if (!field) return props;
  return {
    ...props,
    id: props.id ?? field.id,
    "aria-describedby": props["aria-describedby"] ?? field.noteId,
    "aria-invalid": props["aria-invalid"] ?? (field.invalid ? true : undefined),
  };
}

export interface FieldProps extends Omit<ComponentProps<"div">, "children"> {
  label: ReactNode;
  /** Aide sous le champ (`caption`, `text-muted`). */
  help?: ReactNode;
  /** Message d'erreur : remplace l'aide et marque le contrôle `aria-invalid`. */
  error?: ReactNode;
  /** Identifiant du contrôle (généré si absent). */
  controlId?: string;
  /** Un contrôle Zinc (Input, Textarea, SelectTrigger dans un Select…). */
  children: ReactNode;
}

/** Libellé au-dessus, contrôle, aide ou erreur dessous. Relie les trois pour les lecteurs d'écran. */
export function Field({ label, help, error, controlId, children, className, ...props }: FieldProps) {
  const generated = useId();
  const id = controlId ?? generated;
  const note = error ?? help;
  const noteId = note ? `${id}-note` : undefined;
  return (
    <div className={cx("zn-field", className)} {...props}>
      <label className="zn-field-label" htmlFor={id}>
        {label}
      </label>
      <FieldContext.Provider value={{ id, noteId, invalid: Boolean(error) }}>{children}</FieldContext.Provider>
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
  return <input className={cx("zn-input", className)} {...useFieldControl(props)} />;
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea className={cx("zn-input", className)} {...useFieldControl(props)} />;
}
