
import { useMemo } from "react";

export default function useEmployeeStats(employees) {
  return useMemo(() => {
    const activeCount = employees.filter(
      (employee) => employee.status === "Active"
    ).length;

    const leaveCount = employees.filter(
      (employee) => employee.status === "On Leave"
    ).length;

    const departmentCount = new Set(
      employees
        .map((employee) => employee.department)
        .filter(Boolean)
    ).size;

    return {
      activeCount,
      leaveCount,
      departmentCount,
    };
  }, [employees]);
}
