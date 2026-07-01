import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

const baseClass =
  "border-0 border-b border-line bg-transparent py-2 text-base outline-none transition-colors focus:border-ink";

function Label({ children }: { children: string }) {
  return (
    <span className="text-xs uppercase tracking-[0.15em] text-zinc-400">
      {children}
    </span>
  );
}

export function Field({
  label,
  className,
  ...props
}: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex flex-col gap-2">
      <Label>{label}</Label>
      <input className={`${baseClass} ${className ?? ""}`} {...props} />
    </label>
  );
}

export function TextareaField({
  label,
  className,
  ...props
}: { label: string } & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className="flex flex-col gap-2">
      <Label>{label}</Label>
      <textarea className={`${baseClass} resize-none ${className ?? ""}`} {...props} />
    </label>
  );
}

export function SelectField({
  label,
  className,
  children,
  ...props
}: { label: string } & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <label className="flex flex-col gap-2">
      <Label>{label}</Label>
      <select className={`${baseClass} ${className ?? ""}`} {...props}>
        {children}
      </select>
    </label>
  );
}
