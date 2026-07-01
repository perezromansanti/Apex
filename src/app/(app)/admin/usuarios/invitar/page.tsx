import { InvitarForm } from "./invitar-form";

export default function InvitarPage() {
  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-bold">Invitar socio</h1>
      <p className="mt-2 text-sm text-zinc-500">
        Le llegará un email con un enlace de acceso para confirmar su cuenta.
      </p>
      <div className="mt-8 border-t border-line pt-8">
        <InvitarForm />
      </div>
    </div>
  );
}
