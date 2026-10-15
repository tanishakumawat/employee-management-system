
import { AlertTriangle, X } from "lucide-react";

export default function DeleteConfirmation({
  employee,
  onCancel,
  onConfirm,
}) {
  if (!employee) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onCancel();
        }
      }}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
            <AlertTriangle size={24} />
          </div>

          <button
            type="button"
            onClick={onCancel}
            aria-label="Close confirmation"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <h2
          id="delete-dialog-title"
          className="mt-5 text-lg font-bold text-slate-900"
        >
          Delete employee?
        </h2>

        <p
          id="delete-dialog-description"
          className="mt-2 text-sm leading-6 text-slate-600"
        >
          Are you sure you want to delete{" "}
          <span className="font-semibold text-slate-900">
            {employee.name}
          </span>
          ? This action cannot be undone.
        </p>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => onConfirm(employee)}
            className="rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700"
          >
            Delete employee
          </button>
        </div>
      </div>
    </div>
  );
}
