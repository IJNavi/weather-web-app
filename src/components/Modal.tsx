import { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  title: string;
  description?: string;
  children: ReactNode;
  onClose: () => void;
}

/**
 * Componente de janela modal para exibir conteúdo em destaque.
 *
 * O modal é renderizado em portal para garantir que fique centralizado na
 * janela de visualização atual do usuário, independentemente da rolagem.
 */
export default function Modal({ title, description, children, onClose }: ModalProps) {
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80">
      <div className="flex min-h-screen items-center justify-center px-4 py-10">
        <div className="relative w-full max-w-3xl rounded-3xl border border-slate-700/90 bg-slate-900/95 p-8 shadow-xl shadow-slate-950/40">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-100">{title}</h2>
              {description ? <p className="mt-2 text-sm text-slate-400">{description}</p> : null}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-slate-700/70 bg-slate-900/80 px-3 py-2 text-slate-300 transition hover:bg-slate-800"
              aria-label="Fechar janela"
            >
              X
            </button>
          </div>

          <div className="mt-6">{children}</div>
        </div>
      </div>
    </div>,
    document.body
  );
}
