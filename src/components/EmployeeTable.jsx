import {
  ArrowUpDown,
  Mail,
  Pencil,
  Trash2,
  UserRound,
  Eye,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router";
import Avatar from "./Avatar";

const statusStyles = {
  Active: {
    badge: "bg-emerald-50 text-emerald-700",
    dot: "bg-emerald-500",
    select: "border-emerald-200 focus:ring-emerald-200",
  },
  "On Leave": {
    badge: "bg-amber-50 text-amber-700",
    dot: "bg-amber-500",
    select: "border-amber-200 focus:ring-amber-200",
  },
  Inactive: {
    badge: "bg-slate-100 text-slate-600",
    dot: "bg-slate-400",
    select: "border-slate-200 focus:ring-slate-200",
  },
};

export default function EmployeeTable({
  visibleEmployees,
  toggleSort,
  openEditModal,
  setDeleteTarget,
  resetFilters,
  onStatusChange,
}) {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[900px] border-collapse text-left">
        <thead>
          <tr className="border-b border-slate-100 bg-white">
            <th className="px-6 py-4">
              <button
                type="button"
                onClick={() => toggleSort("name")}
                className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 hover:text-indigo-700"
              >
                Employee
                <ArrowUpDown size={13} />
              </button>
            </th>

            <th className="px-4 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Role & department
            </th>

            <th className="px-4 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Contact
            </th>

            <th className="px-4 py-4">
              <button
                type="button"
                onClick={() => toggleSort("status")}
                className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 hover:text-indigo-700"
              >
                Status
                <ArrowUpDown size={13} />
              </button>
            </th>

            <th className="px-5 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {visibleEmployees.map((employee, index) => {
            const currentStatus = employee.status || "Active";
            const styles =
              statusStyles[currentStatus] || statusStyles.Inactive;

            return (
              <tr
                key={employee.id}
                className="transition hover:bg-slate-50/80"
              >
                {/* Employee information */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={employee.name} index={index} />

                    <div className="min-w-0">
                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/employees/${encodeURIComponent(employee.id)}`
                          )
                        }
                        className="text-left text-sm font-semibold text-slate-800 hover:text-indigo-700 hover:underline"
                        title={`View ${employee.name}'s profile`}
                      >
                        {employee.name}
                      </button>

                      <p className="mt-1 text-xs text-slate-400">
                        {employee.id}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Role and department */}
                <td className="px-4 py-4">
                  <p className="text-sm font-medium text-slate-700">
                    {employee.role}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {employee.department}
                  </p>
                </td>

                {/* Contact information */}
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Mail
                      size={14}
                      className="shrink-0 text-slate-400"
                    />

                    <span className="max-w-[220px] truncate">
                      {employee.email}
                    </span>
                  </div>

                  <p className="mt-1.5 pl-[22px] text-xs text-slate-500">
                    {employee.phone || "No phone provided"}
                  </p>
                </td>

                {/* Status Badge Dropdown */}
                <td className="px-4 py-4">
                  <div className="relative inline-flex">
                    <select
                      value={currentStatus}
                      onChange={(event) =>
                        onStatusChange(employee.id, event.target.value)
                      }
                      aria-label={`Change status for ${employee.name}`}
                      title={`Change ${employee.name}'s status`}
                      className={`cursor-pointer appearance-none rounded-full border-0 py-1.5 pl-6 pr-7 text-xs font-semibold outline-none transition focus:ring-2 ${currentStatus === "Active"
                          ? "bg-emerald-50 text-emerald-700 focus:ring-emerald-200"
                          : currentStatus === "On Leave"
                            ? "bg-amber-50 text-amber-700 focus:ring-amber-200"
                            : "bg-slate-100 text-slate-600 focus:ring-slate-200"
                        }`}
                    >
                      <option value="Active">Active</option>
                      <option value="On Leave">On Leave</option>
                      <option value="Inactive">Inactive</option>
                    </select>

                    {/* Status dot */}
                    <span
                      className={`pointer-events-none absolute left-2.5 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full ${currentStatus === "Active"
                          ? "bg-emerald-500"
                          : currentStatus === "On Leave"
                            ? "bg-amber-500"
                            : "bg-slate-400"
                        }`}
                    />

                    {/* Dropdown arrow */}
                    <ChevronDown
                      size={12}
                      className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2"
                    />
                  </div>
                </td>

                {/* Actions */}
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-1">
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/employees/${encodeURIComponent(employee.id)}`
                        )
                      }
                      title={`View ${employee.name}`}
                      aria-label={`View ${employee.name}`}
                      className="rounded-lg p-2 text-slate-500 transition hover:bg-sky-50 hover:text-sky-700"
                    >
                      <Eye size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={() => openEditModal(employee)}
                      title={`Edit ${employee.name}`}
                      aria-label={`Edit ${employee.name}`}
                      className="rounded-lg p-2 text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-700"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteTarget(employee)}
                      title={`Delete ${employee.name}`}
                      aria-label={`Delete ${employee.name}`}
                      className="rounded-lg p-2 text-slate-500 transition hover:bg-rose-50 hover:text-rose-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}

          {/* Empty state */}
          {visibleEmployees.length === 0 && (
            <tr>
              <td colSpan={5} className="px-6 py-16 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <UserRound size={24} />
                </div>

                <p className="mt-4 text-sm font-semibold text-slate-800">
                  No employees found
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Try a different search or clear your filters.
                </p>

                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-4 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  Clear all filters
                </button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
