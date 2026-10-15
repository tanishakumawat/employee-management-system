
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, AlertCircle, X } from "lucide-react";

import { useEmployees } from "../context/EmployeeContext";
import {
  departments,
  employeeRoles,
} from "../data/employees";
import EmployeeModal from "../components/EmployeeModal";

export default function EmployeeFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    employees,
    addEmployee,
    updateEmployee,
  } = useEmployees();

  const [error, setError] = useState("");

  const isEditing = Boolean(id);

  const employee = isEditing
    ? employees.find((item) => String(item.id) === id)
    : null;

  function handleSave(formData) {
    setError("");

    const name = String(formData.name ?? "").trim();
    const email = String(formData.email ?? "")
      .trim()
      .toLowerCase();
    const department = String(formData.department ?? "").trim();
    const role = String(formData.role ?? "").trim();

    // Validate required fields
    if (!name || !email || !department || !role) {
      setError(
        "Please fill in all required fields: name, email, department, and role."
      );
      return;
    }

    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Prevent duplicate email addresses
    const duplicateEmail = employees.some(
      (item) =>
        String(item.email ?? "").trim().toLowerCase() === email &&
        String(item.id) !== String(id ?? "")
    );

    if (duplicateEmail) {
      setError("An employee with this email already exists.");
      return;
    }

    const employeeData = {
      ...formData,
      name,
      email,
      department,
      role,
    };

    if (isEditing) {
      updateEmployee(id, employeeData);
    } else {
      addEmployee(employeeData);
    }

    // Show success message after returning to the directory
    navigate("/employees", {
      replace: true,
      state: {
        successMessage: isEditing
          ? "Employee updated successfully!"
          : "Employee added successfully!",
      },
    });
  }

  if (isEditing && !employee) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-slate-900">
            Employee not found
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            This employee may have been deleted or the ID is invalid.
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

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-8">
      {error && (
        <div
          role="alert"
          className="fixed left-1/2 top-4 z-[100] flex w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 items-start gap-3 rounded-xl border border-red-200 bg-white p-4 text-sm text-red-700 shadow-lg"
        >
          <AlertCircle
            size={19}
            className="mt-0.5 shrink-0"
          />

          <p className="flex-1 leading-5">{error}</p>

          <button
            type="button"
            aria-label="Dismiss error"
            onClick={() => setError("")}
            className="rounded-md p-1 text-red-500 transition hover:bg-red-50"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="mx-auto max-w-3xl">
        <button
          type="button"
          onClick={() => navigate("/employees")}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-indigo-600"
        >
          <ArrowLeft size={17} />
          Back to employees
        </button>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">
            {isEditing ? "Edit Employee" : "Add New Employee"}
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            {isEditing
              ? "Update the employee's information."
              : "Enter the details to add a new employee."}
          </p>
        </div>

        <EmployeeModal
          key={id || "new-employee"}
          employee={employee}
          departments={departments}
          employeeRoles={employeeRoles}
          onClose={() => navigate("/employees")}
          onSave={handleSave}
        />
      </div>
    </main>
  );
}
