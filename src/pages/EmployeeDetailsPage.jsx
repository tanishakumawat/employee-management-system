
import { Link, useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  CalendarDays,
  Building2,
  Mail,
  Phone,
  Pencil,
  UserRound,
  BriefcaseBusiness,
  ShieldCheck,
} from "lucide-react";

import { useEmployees } from "../context/EmployeeContext";

export default function EmployeeDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { employees } = useEmployees();

  const employee = employees.find((item) => item.id === id);

  if (!employee) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f8fc] p-6">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-600">
            <UserRound size={26} />
          </div>

          <h1 className="mt-4 text-xl font-bold text-slate-900">
            Employee not found
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            This employee may have been removed or the employee ID is invalid.
          </p>

          <button
            type="button"
            onClick={() => navigate("/employees")}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            <ArrowLeft size={16} />
            Back to employees
          </button>
        </div>
      </main>
    );
  }

  const details = [
    {
      label: "Employee ID",
      value: employee.id,
      icon: ShieldCheck,
    },
    {
      label: "Email Address",
      value: employee.email || "Not provided",
      icon: Mail,
    },
    {
      label: "Phone Number",
      value: employee.phone || "Not provided",
      icon: Phone,
    },
    {
      label: "Department",
      value: employee.department || "Not assigned",
      icon: Building2,
    },
    {
      label: "Job Role",
      value: employee.role || "Not assigned",
      icon: BriefcaseBusiness,
    },
    {
      label: "Joining Date",
      value: employee.joinedDate || "Not provided",
      icon: CalendarDays,
    },
  ];

  const isActive = employee.status === "Active";

  return (
    <main className="min-h-screen bg-[#f7f8fc] p-4 text-slate-800 sm:p-7 lg:p-9">
      <div className="mx-auto max-w-5xl">
        {/* Navigation */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigate("/employees")}
            className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-white hover:text-indigo-600"
          >
            <ArrowLeft size={17} />
            Back to employees
          </button>

          <Link
            to={`/employees/${employee.id}/edit`}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            <Pencil size={16} />
            Edit Employee
          </Link>
        </div>

        {/* Employee profile */}
        <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-800 px-6 py-8 sm:px-9 sm:py-10">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-2xl font-bold text-white shadow-lg">
                {employee.name
                  ?.trim()
                  .split(/\s+/)
                  .slice(0, 2)
                  .map((part) => part[0]?.toUpperCase())
                  .join("") || "EM"}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-200">
                  Employee Profile
                </p>

                <h1 className="mt-2 break-words text-2xl font-bold text-white sm:text-3xl">
                  {employee.name}
                </h1>

                <p className="mt-1 text-sm text-indigo-100 sm:text-base">
                  {employee.role || "Role not assigned"}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                      isActive
                        ? "bg-emerald-400/15 text-emerald-100"
                        : employee.status === "On Leave"
                          ? "bg-amber-300/15 text-amber-100"
                          : "bg-white/15 text-white"
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        isActive
                          ? "bg-emerald-300"
                          : employee.status === "On Leave"
                            ? "bg-amber-300"
                            : "bg-white"
                      }`}
                    />
                    {employee.status || "Unknown status"}
                  </span>

                  <span className="text-xs text-indigo-100">
                    {employee.id}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="p-6 sm:p-9">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-slate-900">
                Employee Information
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Contact details and employment information.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {details.map(({ label, value, icon: Icon }) => (
                <div
                  key={label}
                  className="min-w-0 rounded-xl border border-slate-200 bg-slate-50/70 p-4 transition hover:border-indigo-200 hover:bg-indigo-50/30"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200/80">
                      <Icon size={18} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-slate-500">
                        {label}
                      </p>

                      <p className="mt-1 break-words text-sm font-semibold text-slate-800">
                        {value}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-3 rounded-xl border border-indigo-100 bg-indigo-50/60 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Need to update this employee?
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Edit their information whenever required.
                </p>
              </div>

              <Link
                to={`/employees/${employee.id}/edit`}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-white px-4 py-2.5 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100"
              >
                <Pencil size={15} />
                Edit details
              </Link>
            </div>
          </div>
        </section>

        <footer className="py-6 text-center text-xs text-slate-400">
         Employee Management System
        </footer>
      </div>
    </main>
  );
}
