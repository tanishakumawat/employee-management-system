
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router";

import { EmployeeProvider } from "./context/EmployeeContext";

import EmployeesPage from "./pages/EmployeesPage";
import EmployeeFormPage from "./pages/EmployeeFormPage";
import EmployeeDetailsPage from "./pages/EmployeeDetailsPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <EmployeeProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<Navigate to="/employees" replace />}
          />

          <Route
            path="/employees"
            element={<EmployeesPage />}
          />

          <Route
            path="/employees/new"
            element={<EmployeeFormPage />}
          />

          <Route
            path="/employees/:id/edit"
            element={<EmployeeFormPage />}
          />

          <Route
            path="/employees/:id"
            element={<EmployeeDetailsPage />}
          />

          <Route
            path="*"
            element={<NotFoundPage />}
          />
        </Routes>
      </BrowserRouter>
    </EmployeeProvider>
  );
}
