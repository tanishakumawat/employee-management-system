
import { ArrowLeft, Home, SearchX } from "lucide-react";
import { Link, useNavigate } from "react-router";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
          <SearchX size={38} strokeWidth={1.7} />
        </div>

        <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-600">
          Error 404
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Page not found
        </h1>

        <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-slate-500">
          The page you're looking for doesn't exist or may have been moved.
          Let's get you back to your employee directory.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <ArrowLeft size={17} />
            Go back
          </button>

          <Link
            to="/employees"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            <Home size={17} />
            Employee directory
          </Link>
        </div>
      </div>
    </div>
  );
}
