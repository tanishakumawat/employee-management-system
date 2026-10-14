
import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowDownAZ,
  ArrowUpDown,
  BriefcaseBusiness,
  Building2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Download,
  Ellipsis,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Pencil,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Trash2,
  UserRound,
  Users,
  X,
  CalendarDays,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import {
  initialEmployees,
  departments,
  employeeRoles,
} from "./data/employees";
import Avatar from "./components/Avatar";
import StatCard from "./components/StatCard";
const STORAGE_KEY = "employee-management-data";

const emptyForm = {
  name: "",
  role: "",
  department: "",
  email: "",
  phone: "",
  status: "Active",
  joinedDate: new Date().toISOString().slice(0, 10),
};

const navItems = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Employees", icon: Users },
  { label: "Departments", icon: Building2 },
  { label: "Activity", icon: Activity },
];

function loadEmployees() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialEmployees;
  } catch {
    return initialEmployees;
  }
}

function getInitials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}


function Field({ label, name, children, error }) {
  return (
    <label className="block min-w-0">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      {children}
      {error && (
        <span className="mt-1 block text-xs text-rose-600">{error}</span>
      )}
    </label>
  );
}
function EmployeeModal({ employee, onClose, onSave }) {
  const [form, setForm] = useState(() => ({
    ...emptyForm,
    ...(employee || {}),
  }));
  const [errors, setErrors] = useState({});

  function updateField(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => ({ ...previous, [name]: "" }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = "Employee name is required.";
    }

    if (!form.email.trim()) {
      nextErrors.email = "Email address is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
    ) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (form.phone && !/^\+?[0-9\s()-]{7,18}$/.test(form.phone.trim())) {
      nextErrors.phone = "Enter a valid phone number.";
    }

    if (!form.role) nextErrors.role = "Please select a role.";
    if (!form.department) {
      nextErrors.department = "Please select a department.";
    }

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    onSave({
      ...form,
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim(),
    });
  }

  const inputClass =
    "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10";


  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/45 p-3 backdrop-blur-sm sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="employee-modal-title"
        className="my-auto w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between border-b border-slate-100 px-5 py-5 sm:px-7">
          <div>
            <h2
              id="employee-modal-title"
              className="text-xl font-bold text-slate-900"
            >
              {employee ? "Edit employee" : "Add new employee"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {employee
                ? "Update the employee's information below."
                : "Fill in the details to create an employee record."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close form"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid gap-4 px-5 py-6 sm:grid-cols-2 sm:px-7">
            <Field label="Full name *" name="name" error={errors.name}>
              <input
                autoFocus
                name="name"
                value={form.name}
                onChange={updateField}
                placeholder="e.g. Aarav Sharma"
                className={inputClass}
                autoComplete="name"
                maxLength={100}
              />
            </Field>

            <Field label="Email address *" name="email" error={errors.email}>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={updateField}
                placeholder="name@company.com"
                className={inputClass}
                autoComplete="email"
                maxLength={254}
              />
            </Field>

            <Field label="Role *" name="role" error={errors.role}>
              <select
                name="role"
                value={form.role}
                onChange={updateField}
                className={inputClass}
              >
                <option value="">Select role</option>
                {employeeRoles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </Field>

            <Field
              label="Department *"
              name="department"
              error={errors.department}
            >
              <select
                name="department"
                value={form.department}
                onChange={updateField}
                className={inputClass}
              >
                <option value="">Select department</option>
                {departments.map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Phone number" name="phone" error={errors.phone}>
              <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={updateField}
                placeholder="+91 98765 43210"
                className={inputClass}
                autoComplete="tel"
                maxLength={18}
              />
            </Field>

            <Field label="Joining date" name="joinedDate">
              <input
                name="joinedDate"
                type="date"
                value={form.joinedDate}
                onChange={updateField}
                className={inputClass}
              />
            </Field>

            <Field label="Employment status" name="status">
              <select
                name="status"
                value={form.status}
                onChange={updateField}
                className={inputClass}
              >
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Inactive">Inactive</option>
              </select>
            </Field>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/80 px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
            >
              {employee ? "Save changes" : "Add employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function App() {
  const [employees, setEmployees] = useState(loadEmployees);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All departments");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [sortBy, setSortBy] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [modalEmployee, setModalEmployee] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
    } catch {
      setToast({
        type: "error",
        message: "Could not save data to browser storage.",
      });
    }
  }, [employees]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const activeCount = employees.filter(
    (employee) => employee.status === "Active"
  ).length;

  const leaveCount = employees.filter(
    (employee) => employee.status === "On Leave"
  ).length;

  const departmentCount = new Set(
    employees.map((employee) => employee.department).filter(Boolean)
  ).size;

  const filteredEmployees = useMemo(() => {
    const query = search.trim().toLowerCase();

    return employees
      .filter((employee) => {
        const matchesSearch = [
          employee.name,
          employee.role,
          employee.email,
        ].some((value) => value?.toLowerCase().includes(query));

        const matchesDepartment =
          departmentFilter === "All departments" ||
          employee.department === departmentFilter;

        const matchesStatus =
          statusFilter === "All statuses" ||
          employee.status === statusFilter;

        return matchesSearch && matchesDepartment && matchesStatus;
      })
      .sort((a, b) => {
        const comparison = (a[sortBy] || "").localeCompare(
          b[sortBy] || "",
          undefined,
          { sensitivity: "base" }
        );

        return sortDirection === "asc" ? comparison : -comparison;
      });
  }, [employees, search, departmentFilter, statusFilter, sortBy, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(filteredEmployees.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const visibleEmployees = filteredEmployees.slice(
    startIndex,
    startIndex + pageSize
  );

  function showToast(message, type = "success") {
    setToast({ message, type });
  }

  function openAddModal() {
    setModalEmployee(null);
    setModalOpen(true);
  }

  function openEditModal(employee) {
    setModalEmployee(employee);
    setModalOpen(true);
  }

  function saveEmployee(form) {
    const duplicateEmail = employees.some(
      (employee) =>
        employee.email.toLowerCase() === form.email.toLowerCase() &&
        employee.id !== modalEmployee?.id
    );

    if (duplicateEmail) {
      showToast("An employee with this email already exists.", "error");
      return;
    }

    if (modalEmployee) {
      setEmployees((previous) =>
        previous.map((employee) =>
          employee.id === modalEmployee.id
            ? { ...employee, ...form }
            : employee
        )
      );
      showToast("Employee updated successfully.");
    } else {
      const newEmployee = {
        ...form,
        id: `EMP-${crypto.randomUUID()}`,
      };

      setEmployees((previous) => [newEmployee, ...previous]);
      setCurrentPage(1);
      setSearch("");
      setDepartmentFilter("All departments");
      setStatusFilter("All statuses");
      showToast("Employee added successfully.");
    }

    setModalOpen(false);
    setModalEmployee(null);
  }

  function confirmDelete() {
    if (!deleteTarget) return;

    setEmployees((previous) =>
      previous.filter((employee) => employee.id !== deleteTarget.id)
    );
    setDeleteTarget(null);
    showToast("Employee deleted successfully.");
  }

  function toggleSort(field) {
    if (sortBy === field) {
      setSortDirection((direction) =>
        direction === "asc" ? "desc" : "asc"
      );
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  }

  function exportEmployees() {
    const headers = [
      "Employee ID",
      "Name",
      "Role",
      "Department",
      "Email",
      "Phone",
      "Status",
      "Joining Date",
    ];

    const rows = filteredEmployees.map((employee) =>
      [
        employee.id,
        employee.name,
        employee.role,
        employee.department,
        employee.email,
        employee.phone,
        employee.status,
        employee.joinedDate,
      ]
        .map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`)
        .join(",")
    );

    const csv = [headers.join(","), ...rows].join("\r\n");
    const blob = new Blob(["\uFEFF", csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "employees.csv";
    link.click();
    URL.revokeObjectURL(url);

    showToast("Employee CSV exported.");
  }

  function resetFilters() {
    setSearch("");
    setDepartmentFilter("All departments");
    setStatusFilter("All statuses");
    setCurrentPage(1);
  }

  const buttonClass =
    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition";

  return (
    <div className="min-h-screen bg-[#f7f8fc] text-slate-800">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex h-[76px] items-center gap-3 border-b border-slate-100 px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-200">
            <Users size={22} />
          </div>
          <div>
            <p className="text-[15px] font-bold tracking-tight text-slate-900">
              PeopleFlow
            </p>
            <p className="text-xs text-slate-500">Employee workspace</p>
          </div>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="ml-auto rounded-lg p-1 text-slate-500 hover:bg-slate-100 lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={19} />
          </button>
        </div>

        <div className="px-4 pt-7">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
            Workspace
          </p>
          <nav className="space-y-1">
            {navItems.map(({ label, icon: Icon }) => {
              const selected = label === "Employees";
              return (
                <button
                  type="button"
                  key={label}
                  onClick={() => {
                    if (label !== "Employees") {
                      showToast(`${label} overview is not part of this demo.`, "error");
                    }
                    setSidebarOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${selected
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                >
                  <Icon size={19} />
                  {label}
                  {selected && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-600" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-8 px-4">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
            Preferences
          </p>
          <button
            type="button"
            onClick={() =>
              showToast("Settings are not part of this assignment demo.", "error")
            }
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900"
          >
            <Settings size={19} />
            Settings
          </button>
          <button
            type="button"
            onClick={() =>
              showToast("Help documentation is not configured yet.", "error")
            }
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900"
          >
            <CircleHelp size={19} />
            Help & support
          </button>
        </div>

        <div className="mt-auto p-4">
          <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 p-4 text-white">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
              <ShieldCheck size={20} />
            </div>
            <p className="text-sm font-semibold">People management</p>
            <p className="mt-1 text-xs leading-5 text-indigo-100">
              Keep employee records organized in one place.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-indigo-100">
              <span className="h-2 w-2 rounded-full bg-emerald-300" />
              Local demo workspace
            </div>
          </div>
          <button
            type="button"
            onClick={() =>
              showToast("This demo does not use account authentication.", "error")
            }
            className="mt-4 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-500 hover:bg-slate-50"
          >
            <LogOut size={18} />
            Sign out
          </button>
        </div>
      </aside>

      <div className="min-w-0 lg:pl-64">
        <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between gap-3 border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-xl sm:px-7 lg:px-9">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              aria-label="Open navigation"
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            >
              <Menu size={21} />
            </button>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900 sm:text-base">
                Employee Management
              </p>
              <p className="mt-0.5 hidden text-xs text-slate-500 sm:block">
                Workspace / Employees
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-800">Admin User</p>
              <p className="text-xs text-slate-500">Administrator</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-indigo-100 bg-indigo-50 text-sm font-bold text-indigo-700">
              AU
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1600px] p-4 sm:p-7 lg:p-9">
          <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-indigo-600">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
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
                onClick={openAddModal}
                className={`${buttonClass} bg-indigo-600 text-white shadow-md shadow-indigo-200 hover:bg-indigo-700`}
              >
                <Plus size={18} />
                Add employee
              </button>
            </div>
          </div>

          <section
            aria-label="Employee statistics"
            className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
          >
            <StatCard
              title="Total employees"
              value={employees.length}
              description="All employee records"
              icon={Users}
              color="bg-indigo-50 text-indigo-600"
            />
            <StatCard
              title="Active employees"
              value={activeCount}
              description={`${employees.length ? Math.round((activeCount / employees.length) * 100) : 0}% of all employees`}
              icon={CheckCircle2}
              color="bg-emerald-50 text-emerald-600"
            />
            <StatCard
              title="On leave"
              value={leaveCount}
              description="Employees currently on leave"
              icon={CalendarDays}
              color="bg-amber-50 text-amber-600"
            />
            <StatCard
              title="Departments"
              value={departmentCount}
              description="Departments represented in your team"
              icon={BriefcaseBusiness}
              color="bg-violet-50 text-violet-600"
            />
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
            <div className="flex flex-col justify-between gap-4 border-b border-slate-100 px-4 py-5 sm:px-6 lg:flex-row lg:items-center">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-slate-900">
                    All employees
                  </h2>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                    {filteredEmployees.length}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  View, search, and manage your employee records.
                </p>
              </div>

              <div className="relative w-full lg:max-w-xs">
                <Search
                  size={17}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  aria-label="Search employees"
                  type="search"
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search name, role, email..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 border-b border-slate-100 bg-slate-50/60 px-4 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:px-6">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <ArrowDownAZ size={16} />
                Filters
              </div>

              <select
                aria-label="Filter by department"
                value={departmentFilter}
                onChange={(event) => {
                  setDepartmentFilter(event.target.value);
                  setCurrentPage(1);
                }}
                className="min-w-0 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:border-indigo-500 sm:max-w-52"
              >
                <option>All departments</option>
                {departments.map((department) => (
                  <option key={department}>{department}</option>
                ))}
              </select>

              <select
                aria-label="Filter by employment status"
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(event.target.value);
                  setCurrentPage(1);
                }}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:border-indigo-500"
              >
                <option>All statuses</option>
                <option>Active</option>
                <option>On Leave</option>
                <option>Inactive</option>
              </select>

              <select
                aria-label="Sort employee records"
                value={`${sortBy}:${sortDirection}`}
                onChange={(event) => {
                  const [field, direction] = event.target.value.split(":");
                  setSortBy(field);
                  setSortDirection(direction);
                  setCurrentPage(1);
                }}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:border-indigo-500"
              >
                <option value="name:asc">Name: A–Z</option>
                <option value="name:desc">Name: Z–A</option>
                <option value="role:asc">Role: A–Z</option>
                <option value="role:desc">Role: Z–A</option>
              </select>

              {(search ||
                departmentFilter !== "All departments" ||
                statusFilter !== "All statuses") && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="text-left text-xs font-semibold text-indigo-600 hover:text-indigo-800 sm:ml-auto"
                  >
                    Clear filters
                  </button>
                )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] border-collapse text-left">
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
                  {visibleEmployees.map((employee, index) => (
                    <tr
                      key={employee.id}
                      className="transition hover:bg-slate-50/80"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={employee.name} index={index} />
                          <div>
                            <p className="text-sm font-semibold text-slate-800">
                              {employee.name}
                            </p>
                            <p className="mt-1 text-xs text-slate-400">
                              {employee.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <p className="text-sm font-medium text-slate-700">
                          {employee.role}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {employee.department}
                        </p>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Mail
                            size={14}
                            className="shrink-0 text-slate-400"
                          />
                          {employee.email}
                        </div>
                        <p className="mt-1.5 pl-[22px] text-xs text-slate-500">
                          {employee.phone || "No phone provided"}
                        </p>
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-semibold ${employee.status === "Active"
                              ? "bg-emerald-50 text-emerald-700"
                              : employee.status === "On Leave"
                                ? "bg-amber-50 text-amber-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${employee.status === "Active"
                                ? "bg-emerald-500"
                                : employee.status === "On Leave"
                                  ? "bg-amber-500"
                                  : "bg-slate-400"
                              }`}
                          />
                          {employee.status}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-1">
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
                  ))}

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

            <div className="flex flex-col gap-4 border-t border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span>
                  Showing{" "}
                  <strong className="text-slate-800">
                    {filteredEmployees.length ? startIndex + 1 : 0}–
                    {Math.min(startIndex + pageSize, filteredEmployees.length)}
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

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Previous page"
                  disabled={safePage <= 1}
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                >
                  <ChevronLeft size={17} />
                </button>
                {Array.from({ length: totalPages }, (_, index) => index + 1)
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
                        aria-current={safePage === page ? "page" : undefined}
                        className={`h-9 min-w-9 rounded-lg px-2 text-xs font-semibold ${safePage === page
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
                    setCurrentPage((page) => Math.min(totalPages, page + 1))
                  }
                  className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                >
                  <ChevronRight size={17} />
                </button>
              </div>
            </div>
          </section>

          <footer className="flex flex-col gap-2 py-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <p>PeopleFlow · Employee Management System</p>
            <p>React · Tailwind CSS · Browser storage</p>
          </footer>
        </main>
      </div>

      {modalOpen && (
        <EmployeeModal
          key={modalEmployee?.id || "new-employee"}
          employee={modalEmployee}
          onClose={() => {
            setModalOpen(false);
            setModalEmployee(null);
          }}
          onSave={saveEmployee}
        />
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
              <Trash2 size={22} />
            </div>
            <h2
              id="delete-title"
              className="mt-4 text-lg font-bold text-slate-900"
            >
              Delete employee?
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Are you sure you want to delete{" "}
              <strong className="text-slate-800">{deleteTarget.name}</strong>?
              This action cannot be undone.
            </p>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className={`${buttonClass} border border-slate-200 text-slate-700 hover:bg-slate-50`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className={`${buttonClass} bg-rose-600 text-white hover:bg-rose-700`}
              >
                <Trash2 size={16} />
                Delete employee
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div
          role="status"
          className={`fixed bottom-5 right-4 z-[70] flex max-w-[calc(100vw-2rem)] items-center gap-3 rounded-xl border px-4 py-3 shadow-lg sm:right-6 ${toast.type === "error"
              ? "border-rose-200 bg-white text-rose-700"
              : "border-emerald-200 bg-white text-emerald-700"
            }`}
        >
          {toast.type === "error" ? (
            <AlertCircle size={19} />
          ) : (
            <CheckCircle2 size={19} />
          )}
          <p className="text-sm font-medium">{toast.message}</p>
          <button
            type="button"
            onClick={() => setToast(null)}
            aria-label="Dismiss notification"
            className="ml-1 rounded-md p-1 opacity-70 hover:bg-slate-100 hover:opacity-100"
          >
            <X size={15} />
          </button>
        </div>
      )}
    </div>
  );
}
