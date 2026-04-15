import Modal from './Modal';

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  title,
  message,
  confirmLabel = 'Sim',
  cancelLabel = 'Não',
  onConfirm,
  onCancel
}: ConfirmDialogProps) {
  return (
    <Modal title={title} description={message} onClose={onCancel}>
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onConfirm}
          className="inline-flex items-center justify-center rounded-3xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
        >
          {confirmLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center justify-center rounded-3xl border border-slate-700/80 bg-slate-800 px-6 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-700"
        >
          {cancelLabel}
        </button>
      </div>
    </Modal>
  );
}
