
import { ArrowDownAZ } from "lucide-react";
import SearchBar from "./SearchBar";

export default function EmployeeToolbar({
  filteredCount,
  searchTerm,
  setSearchTerm,
  departmentFilter,
  setDepartmentFilter,
  statusFilter,
  setStatusFilter,
  departments,
  sortBy,
  sortDirection,
  setSortBy,
  setSortDirection,
  setCurrentPage,
  resetFilters,
}) {
  const hasActiveFilters =
    searchTerm.trim() !== "" ||
    departmentFilter !== "All departments" ||
    statusFilter !== "All statuses";

  return (
    <>
      <div className="flex flex-col justify-between gap-4 border-b border-slate-100 px-4 py-5 sm:px-6 lg:flex-row lg:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">
              All employees
            </h2>

            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
              {filteredCount}
            </span>
          </div>

          <p className="mt-1 text-xs text-slate-500">
            View, search, and manage your employee records.
          </p>
        </div>

        <div className="w-full lg:max-w-xs">
          <SearchBar
            value={searchTerm}
            onChange={(value) => {
              setSearchTerm(value);
              setCurrentPage(1);
            }}
            placeholder="Search by name, role, or email..."
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
            <option key={department} value={department}>
              {department}
            </option>
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

        {hasActiveFilters && (
          <button
            type="button"
            onClick={resetFilters}
            className="text-left text-xs font-semibold text-indigo-600 hover:text-indigo-800 sm:ml-auto"
          >
            Clear filters
          </button>
        )}
      </div>
    </>
  );
}
