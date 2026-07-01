import { PruebaForm } from "../prueba-form";

export default function NuevaPruebaPage() {
  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-bold">Nueva prueba</h1>
      <div className="mt-8 border-t border-line pt-8">
        <PruebaForm />
      </div>
    </div>
  );
}
