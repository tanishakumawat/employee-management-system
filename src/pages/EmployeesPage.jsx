
import { useMemo, useState, useEffect } from "react";
import {
    Activity,
    Building2,
    CheckCircle2,
    LayoutDashboard,
    Menu,
    Users,
    X,
    AlertCircle,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import {
    departments,
    employeeRoles,
} from "../data/employees";

import { useEmployees } from "../context/EmployeeContext";

import Sidebar from "../components/Sidebar";
import DashboardHeader from "../components/DashboardHeader";
import DashboardStats from "../components/DashboardStats";
import useEmployeeStats from "../hooks/useEmployeeStats";
import EmployeeModal from "../components/EmployeeModal";
import DeleteConfirmation from "../components/DeleteConfirmation";
import EmployeeToolbar from "../components/EmployeeToolbar";
import EmployeeTable from "../components/EmployeeTable";
import Pagination from "../components/Pagination";

const navItems = [
    { label: "Overview", icon: LayoutDashboard },
    { label: "Employees", icon: Users },
    { label: "Departments", icon: Building2 },
    { label: "Activity", icon: Activity },
];

export default function EmployeesPage() {
    const location = useLocation();
    const navigate = useNavigate();
    // Shared employee state from Context API
    const {
        employees,
        addEmployee,
        updateEmployee,
        deleteEmployee,
    } = useEmployees();

    // Dashboard state
    const [search, setSearch] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [departmentFilter, setDepartmentFilter] =
        useState("All departments");
    const [statusFilter, setStatusFilter] =
        useState("All statuses");
    const [sortBy, setSortBy] = useState("name");
    const [sortDirection, setSortDirection] = useState("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    // Modal and notification state
    const [modalEmployee, setModalEmployee] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [toast, setToast] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Automatically dismiss notifications
    useState(() => {
        return undefined;
    });

    // Employee statistics
    const {
        activeCount,
        leaveCount,
        departmentCount,
    } = useEmployeeStats(employees);
    useEffect(() => {
        const message = location.state?.successMessage;

        if (!message) return;

        setToast({
            type: "success",
            message,
        });

        navigate(location.pathname, {
            replace: true,
            state: null,
        });
    }, [location, navigate]);
    // Search, filter, and sort employees
    const filteredEmployees = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();

        return employees
            .filter((employee) => {
                const matchesSearch = [
                    employee.id,
                    employee.name,
                    employee.role,
                    employee.email,
                    employee.department,
                ].some((value) =>
                    String(value ?? "").toLowerCase().includes(query)
                );

                const matchesDepartment =
                    departmentFilter === "All departments" ||
                    employee.department === departmentFilter;

                const matchesStatus =
                    statusFilter === "All statuses" ||
                    employee.status === statusFilter;

                return (
                    matchesSearch &&
                    matchesDepartment &&
                    matchesStatus
                );
            })
            .sort((a, b) => {
                const comparison = String(a[sortBy] ?? "").localeCompare(
                    String(b[sortBy] ?? ""),
                    undefined,
                    { sensitivity: "base" }
                );

                return sortDirection === "asc"
                    ? comparison
                    : -comparison;
            });
    }, [
        employees,
        searchTerm,
        departmentFilter,
        statusFilter,
        sortBy,
        sortDirection,
    ]);

    // Pagination
    const totalPages = Math.max(
        1,
        Math.ceil(filteredEmployees.length / pageSize)
    );

    const safePage = Math.min(currentPage, totalPages);
    const startIndex = (safePage - 1) * pageSize;

    const visibleEmployees = filteredEmployees.slice(
        startIndex,
        startIndex + pageSize
    );

    // Toast notifications
    function showToast(message, type = "success") {
        setToast({ message, type });
    }

    // Open add employee modal
    function openAddModal() {
        setModalEmployee(null);
        setModalOpen(true);
    }

    // Open edit employee modal
    function openEditModal(employee) {
        setModalEmployee(employee);
        setModalOpen(true);
    }

    // Save an employee through Context
    function saveEmployee(form) {
        const normalizedEmail = String(form.email ?? "")
            .trim()
            .toLowerCase();

        const duplicateEmail = employees.some(
            (employee) =>
                String(employee.email ?? "").trim().toLowerCase() ===
                normalizedEmail &&
                employee.id !== modalEmployee?.id
        );

        if (duplicateEmail) {
            showToast(
                "An employee with this email already exists.",
                "error"
            );
            return;
        }

        const employeeData = {
            ...form,
            name: String(form.name ?? "").trim(),
            email: normalizedEmail,
        };

        if (modalEmployee) {
            updateEmployee(modalEmployee.id, employeeData);
            showToast("Employee updated successfully.");
        } else {
            addEmployee(employeeData);
            setCurrentPage(1);
            setSearch("");
            setSearchTerm("");
            setDepartmentFilter("All departments");
            setStatusFilter("All statuses");
            showToast("Employee added successfully.");
        }

        setModalOpen(false);
        setModalEmployee(null);
    }

    // Delete an employee through Context
    function handleDeleteEmployee(id) {
        deleteEmployee(id);
        showToast("Employee deleted successfully.");
    }

    function confirmDelete() {
        if (!deleteTarget) return;

        handleDeleteEmployee(deleteTarget.id);
        setDeleteTarget(null);
    }

    // Sorting
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

    // Export filtered employee records to CSV

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

        function escapeCsv(value) {
            return `"${String(value ?? "").replace(/"/g, '""')}"`;
        }

        // Keep phone numbers as text and format dates consistently.
        function formatDate(value) {
            if (!value) return "";

            // Preserve an already formatted date string.
            const dateString = String(value).trim();

            // Handle YYYY-MM-DD without timezone-related date shifts.
            const isoDateMatch = dateString.match(
                /^(\d{4})-(\d{2})-(\d{2})$/
            );

            if (isoDateMatch) {
                return `${isoDateMatch[3]}/${isoDateMatch[2]}/${isoDateMatch[1]}`;
            }

            const date = new Date(value);

            if (Number.isNaN(date.getTime())) {
                return dateString;
            }

            const day = String(date.getDate()).padStart(2, "0");
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const year = date.getFullYear();

            return `${day}/${month}/${year}`;
        }

        const rows = filteredEmployees.map((employee) => [
            employee.id,
            employee.name,
            employee.role,
            employee.department,
            employee.email,

            // Prefix phone numbers with an apostrophe so Excel treats them as text.
            employee.phone ? `'${String(employee.phone).trim()}` : "",

            employee.status,
            formatDate(employee.joinedDate),
        ]);

        const csv = [
            headers.map(escapeCsv).join(","),
            ...rows.map((row) => row.map(escapeCsv).join(",")),
        ].join("\r\n");

        // UTF-8 BOM helps Excel identify the CSV encoding.
        const blob = new Blob(["\uFEFF", csv], {
            type: "text/csv;charset=utf-8;",
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "employees.csv";

        document.body.appendChild(link);
        link.click();
        link.remove();

        // Revoke after the browser has had a chance to start the download.
        setTimeout(() => URL.revokeObjectURL(url), 1000);

        showToast("Employee CSV exported successfully.");
    }

    function handleStatusChange(employeeId, newStatus) {
        updateEmployee(employeeId, { status: newStatus });
        showToast("Employee status updated successfully.");
    }
    // Reset dashboard filters
    function resetFilters() {
        setSearch("");
        setSearchTerm("");
        setDepartmentFilter("All departments");
        setStatusFilter("All statuses");
        setCurrentPage(1);
    }

    const buttonClass =
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition";

    return (
        <div className="min-h-screen bg-[#f7f8fc] text-slate-800">
            <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                navItems={navItems}
                showToast={showToast}
            />

            <div className="min-w-0 lg:pl-64">
                {/* Header */}
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
                            <p className="text-sm font-semibold text-slate-800">
                                Admin One
                            </p>
                            <p className="text-xs text-slate-500">
                                Administrator
                            </p>
                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-indigo-100 bg-indigo-50 text-sm font-bold text-indigo-700">
                            AO
                        </div>
                    </div>
                </header>

                {/* Main dashboard */}
                <main className="mx-auto max-w-[1600px] p-4 sm:p-7 lg:p-9">
                    <DashboardHeader
                        exportEmployees={exportEmployees}
                        buttonClass={buttonClass}
                    />

                    <DashboardStats
                        totalEmployees={employees.length}
                        activeCount={activeCount}
                        leaveCount={leaveCount}
                        departmentCount={departmentCount}
                    />

                    <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
                        <EmployeeToolbar
                            filteredCount={filteredEmployees.length}
                            searchTerm={searchTerm}
                            setSearchTerm={(value) => {
                                setSearchTerm(value);
                                setSearch(value);
                                setCurrentPage(1);
                            }}
                            departmentFilter={departmentFilter}
                            setDepartmentFilter={(value) => {
                                setDepartmentFilter(value);
                                setCurrentPage(1);
                            }}
                            statusFilter={statusFilter}
                            setStatusFilter={(value) => {
                                setStatusFilter(value);
                                setCurrentPage(1);
                            }}
                            departments={departments}
                            sortBy={sortBy}
                            sortDirection={sortDirection}
                            setSortBy={setSortBy}
                            setSortDirection={setSortDirection}
                            setCurrentPage={setCurrentPage}
                            resetFilters={resetFilters}
                        />

                        <EmployeeTable
                            visibleEmployees={visibleEmployees}
                            toggleSort={toggleSort}
                            openEditModal={openEditModal}
                            setDeleteTarget={setDeleteTarget}
                            resetFilters={resetFilters}
                            onStatusChange={handleStatusChange}
                        />

                        <Pagination
                            filteredEmployees={filteredEmployees}
                            startIndex={startIndex}
                            pageSize={pageSize}
                            setPageSize={(value) => {
                                setPageSize(Number(value));
                                setCurrentPage(1);
                            }}
                            setCurrentPage={setCurrentPage}
                            safePage={safePage}
                            totalPages={totalPages}
                        />
                    </section>

                    <footer className="flex flex-col gap-2 py-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
                        <p>Employee Management System</p>
                    </footer>
                </main>
            </div>

            {/* Add / Edit modal */}
            {modalOpen && (
                <EmployeeModal
                    key={modalEmployee?.id || "new-employee"}
                    employee={modalEmployee}
                    departments={departments}
                    employeeRoles={employeeRoles}
                    onClose={() => {
                        setModalOpen(false);
                        setModalEmployee(null);
                    }}
                    onSave={saveEmployee}
                />
            )}

            {/* Delete confirmation */}
            {deleteTarget && (
                <DeleteConfirmation
                    employee={deleteTarget}
                    onCancel={() => setDeleteTarget(null)}
                    onConfirm={confirmDelete}
                />
            )}

            {/* Toast notification */}
            {toast && (
                <div
                    role="status"
                    aria-live="polite"
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
