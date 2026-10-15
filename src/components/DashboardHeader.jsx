
import { Download, Plus } from "lucide-react";
import { useNavigate } from "react-router";

export default function DashboardHeader({
  exportEmployees,
  buttonClass,
}) {
  const navigate = useNavigate();

  return (
    <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-indigo-600">
          PEOPLE & ORGANIZATION
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Employee directory
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Manage your team, employee records, and organizational details.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={exportEmployees}
          className={`${buttonClass} border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50`}
        >
          <Download size={17} />
          <span className="hidden sm:inline">Export CSV</span>
          <span className="sm:hidden">Export</span>
        </button>

        <button
          type="button"
          onClick={() => navigate("/employees/new")}
          className={`${buttonClass} bg-indigo-600 text-white shadow-md shadow-indigo-200 hover:bg-indigo-700`}
        >
          <Plus size={18} />
          Add employee
        </button>
      </div>
    </div>
  );
}
