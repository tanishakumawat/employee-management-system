
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  filteredEmployees,
  startIndex,
  pageSize,
  setPageSize,
  setCurrentPage,
  safePage,
  totalPages,
}) {
  return (
    <div className="flex flex-col gap-4 border-t border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <span>
          Showing{" "}
          <strong className="text-slate-800">
            {filteredEmployees.length ? startIndex + 1 : 0}–
            {Math.min(
              startIndex + pageSize,
              filteredEmployees.length
            )}
          </strong>{" "}
          of{" "}
          <strong className="text-slate-800">
            {filteredEmployees.length}
          </strong>
        </span>

        <span className="text-slate-300">|</span>

        <label className="flex items-center gap-2">
          Rows
          <select
            value={pageSize}
            onChange={(event) => {
              setPageSize(Number(event.target.value));
              setCurrentPage(1);
            }}
            className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-700 outline-none"
            aria-label="Rows per page"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          aria-label="Previous page"
          disabled={safePage <= 1}
          onClick={() =>
            setCurrentPage((page) => Math.max(1, page - 1))
          }
          className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
        >
          <ChevronLeft size={17} />
        </button>

        {Array.from(
          { length: totalPages },
          (_, index) => index + 1
        )
          .filter(
            (page) =>
              page === 1 ||
              page === totalPages ||
              Math.abs(page - safePage) <= 1
          )
          .map((page, index, pages) => (
            <span key={page} className="contents">
              {index > 0 && pages[index - 1] !== page - 1 && (
                <span className="px-1 text-slate-400">…</span>
              )}

              <button
                type="button"
                onClick={() => setCurrentPage(page)}
                aria-current={
                  safePage === page ? "page" : undefined
                }
                className={`h-9 min-w-9 rounded-lg px-2 text-xs font-semibold ${
                  safePage === page
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {page}
              </button>
            </span>
          ))}

        <button
          type="button"
          aria-label="Next page"
          disabled={safePage >= totalPages}
          onClick={() =>
            setCurrentPage((page) =>
              Math.min(totalPages, page + 1)
            )
          }
          className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
        >
          <ChevronRight size={17} />
        </button>
      </div>
    </div>
  );
}
