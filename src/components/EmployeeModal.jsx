import { useState } from "react";
import { X } from "lucide-react";

const emptyForm = {
  name: "",
  role: "",
  department: "",
  email: "",
  phone: "",
  alternatePhone: "",
  status: "Active",
  joinedDate: new Date().toISOString().slice(0, 10),
};

function Field({ label, children, error }) {
  return (
    <label className="block min-w-0">
      <span className="text-sm font-semibold text-slate-700">
        {label}
      </span>

      {children}

      {error && (
        <span className="mt-1 block text-xs text-rose-600">
          {error}
        </span>
      )}
    </label>
  );
}

export default function EmployeeModal({
  employee,
  departments,
  employeeRoles,
  onClose,
  onSave,
}) {
  const [form, setForm] = useState(() => ({
    ...emptyForm,
    ...(employee || {}),
    alternatePhone:
      employee?.alternatePhone ??
      employee?.alternatePhoneNumber ??
      "",
  }));

  const [errors, setErrors] = useState({});

  const inputClass =
    "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10";

  function updateField(event) {
    const { name, value } = event.target;
    let nextValue = value;
    let error = "";

    if (name === "name") {
      // Remove invalid characters from the name.
      nextValue = value.replace(/[^a-zA-Z\s'.-]/g, "");

      if (value !== nextValue) {
        error = "Only characters are allowed in the name.";
      } else if (nextValue.trim() && !/[a-zA-Z]/.test(nextValue)) {
        error = "Name must contain at least one letter.";
      }
    }

    if (name === "phone" || name === "alternatePhone") {
      // Allow digits only, up to 10.
      nextValue = value.replace(/\D/g, "").slice(0, 10);

      if (value !== nextValue) {
        error = "Only digits are allowed.";
      } else if (nextValue.length > 0 && nextValue.length < 10) {
        error = "Enter exactly 10 digits.";
      }
    }

    setForm((previous) => ({
      ...previous,
      [name]: nextValue,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: error,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = {};

    // Full name validation
    if (!form.name.trim()) {
      nextErrors.name = "Employee name is required.";
    } else if (!/^[a-zA-Z\s'.-]+$/.test(form.name.trim())) {
      nextErrors.name = "Only characters are allowed in the name.";
    }
    // Email validation
    if (!form.email.trim()) {
      nextErrors.email = "Email address is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
    ) {
      nextErrors.email = "Enter a valid email address.";
    }

    // Required phone number validation
    if (!form.phone.trim()) {
      nextErrors.phone = "Phone number is required.";
    } else if (!/^\d{10}$/.test(form.phone)) {
      nextErrors.phone = "Phone number must contain exactly 10 digits.";
    }

    if (
      form.alternatePhone &&
      !/^\d{10}$/.test(form.alternatePhone)
    ) {
      nextErrors.alternatePhone =
        "Alternate phone number must contain exactly 10 digits.";
    }
    // Role validation
    if (!form.role) {
      nextErrors.role = "Please select a role.";
    }

    // Department validation
    if (!form.department) {
      nextErrors.department = "Please select a department.";
    }

    // Stop submission if validation errors exist.
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    // Save validated employee data.
    onSave({
      ...form,
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim(),
      alternatePhone: form.alternatePhone.trim(),
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/45 p-3 backdrop-blur-sm sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="employee-modal-title"
        className="my-auto w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        {/* Modal Header */}
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

        {/* Employee Form */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="grid gap-4 px-5 py-6 sm:grid-cols-2 sm:px-7">
            {/* Full Name */}
            <Field label="Full name *" error={errors.name}>
              <input
                autoFocus
                name="name"
                type="text"
                value={form.name}
                onChange={updateField}
                placeholder="e.g. Aarav Sharma"
                className={inputClass}
                autoComplete="name"
                maxLength={100}
                required
                aria-invalid={Boolean(errors.name)}
              />
            </Field>

            {/* Email */}
            <Field label="Email address *" error={errors.email}>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={updateField}
                placeholder="name@company.com"
                className={inputClass}
                autoComplete="email"
                maxLength={254}
                required
                aria-invalid={Boolean(errors.email)}
              />
            </Field>

            {/* Role */}
            <Field label="Role *" error={errors.role}>
              <select
                name="role"
                value={form.role}
                onChange={updateField}
                className={inputClass}
                required
                aria-invalid={Boolean(errors.role)}
              >
                <option value="">Select role</option>

                {employeeRoles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </Field>

            {/* Department */}
            <Field
              label="Department *"
              error={errors.department}
            >
              <select
                name="department"
                value={form.department}
                onChange={updateField}
                className={inputClass}
                required
                aria-invalid={Boolean(errors.department)}
              >
                <option value="">Select department</option>

                {departments.map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>
            </Field>

            {/* Required Phone Number */}
            <Field label="Phone number *" error={errors.phone}>
              <input
                name="phone"
                type="tel"
                inputMode="numeric"
                value={form.phone}
                onChange={updateField}
                placeholder="9876543210"
                className={inputClass}
                autoComplete="tel-national"
                maxLength={10}
                required
                aria-invalid={Boolean(errors.phone)}
              />
            </Field>

            {/* Optional Alternate Phone */}
            <Field
              label="Alternate phone number (optional)"
              error={errors.alternatePhone}
            >
              <input
                name="alternatePhone"
                type="tel"
                inputMode="numeric"
                value={form.alternatePhone}
                onChange={updateField}
                placeholder="9876543210"
                className={inputClass}
                autoComplete="off"
                maxLength={10}
                aria-invalid={Boolean(errors.alternatePhone)}
              />
            </Field>

            {/* Joining Date */}
            <Field label="Joining date">
              <input
                name="joinedDate"
                type="date"
                value={form.joinedDate}
                onChange={updateField}
                className={inputClass}
              />
            </Field>

            {/* Employment Status */}
            <Field label="Employment status">
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

          {/* Modal Footer */}
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
