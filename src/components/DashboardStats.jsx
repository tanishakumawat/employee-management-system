
import StatCard from "./StatCard";
import {
  Users,
  CheckCircle2,
  CalendarDays,
  BriefcaseBusiness,
} from "lucide-react";

export default function DashboardStats({
  totalEmployees,
  activeCount,
  leaveCount,
  departmentCount,
}) {
  return (
    <section
      aria-label="Employee statistics"
      className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      <StatCard
        title="Total employees"
        value={totalEmployees}
        description="All employee records"
        icon={Users}
        color="bg-indigo-50 text-indigo-600"
      />

      <StatCard
        title="Active employees"
        value={activeCount}
        description={`${
          totalEmployees
            ? Math.round((activeCount / totalEmployees) * 100)
            : 0
        }% of all employees`}
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
  );
}
