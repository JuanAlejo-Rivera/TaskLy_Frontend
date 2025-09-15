import { useState } from "react";
import { Info, X } from "lucide-react";

export default function TooltipNote() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 max-w-xs">
      <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-xl p-4">
        {/* Botón de cerrar */}
        <button
          onClick={() => setVisible(false)}
          className="absolute top-2 right-2 text-white/80 hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icono y texto */}
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 mt-1 flex-shrink-0" />
          <div>
            <p className="font-semibold">Acceso de prueba</p>
            <p className="text-sm text-gray-100">
              Usa estos correos para entrar sin registrarte:
            </p>
            <ul className="mt-2 space-y-1 text-sm">
              <li>
                📧 <code>demo1@correo.com</code> / <code>12345678</code>
              </li>
              <li>
                📧 <code>demo2@correo.com</code> / <code>12345678</code>
              </li>
            </ul>
            <p className="mt-3 text-xs text-gray-200 leading-snug">
              ⚠️ Esto se debe a que los correos de confirmación llegan a
              <span className="font-semibold"> Mailtrap</span>, un programa gratuito
              para pruebas de envío de correos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
