
import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import { initialEmployees } from "../data/employees";

const EmployeeContext = createContext(null);

const STORAGE_KEY = "employee-management-data";

function loadEmployees() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : initialEmployees;
    } catch {
        return initialEmployees;
    }
}

export function EmployeeProvider({ children }) {
    const [employees, setEmployees] = useState(loadEmployees);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
        } catch (error) {
            console.error("Could not save employees:", error);
        }
    }, [employees]);

    function addEmployee(employeeData) {
        const newEmployee = {
            ...employeeData,
            id: `EMP-${crypto.randomUUID()}`,
        };

        setEmployees((previous) => [newEmployee, ...previous]);

        return newEmployee;
    }


    function updateEmployee(id, employeeData) {
        setEmployees((previous) =>
            previous.map((employee) =>
                employee.id === id
                    ? { ...employee, ...employeeData, id }
                    : employee
            )
        );
    }

    function deleteEmployee(id) {
        setEmployees((previous) =>
            previous.filter((employee) => employee.id !== id)
        );
    }

    function getEmployee(id) {
        return employees.find((employee) => employee.id === id);
    }

    return (
        <EmployeeContext.Provider
            value={{
                employees,
                addEmployee,
                updateEmployee,
                deleteEmployee,
                getEmployee,
            }}
        >
            {children}
        </EmployeeContext.Provider>
    );
}

export function useEmployees() {
    const context = useContext(EmployeeContext);

    if (!context) {
        throw new Error(
            "useEmployees must be used inside EmployeeProvider"
        );
    }

    return context;
}
