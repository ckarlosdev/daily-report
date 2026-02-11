import { createHashRouter } from "react-router-dom";
import Home from "./Home";
import Employee from "../resources/employee/Employee";
import Equipment from "../resources/equipment/Equipment";
import ProtectedRoute from "./ProtectedRoute";

const router = createHashRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path: "/employee",
    element: (
      <ProtectedRoute>
        <Employee />
      </ProtectedRoute>
    ),
  },
  {
    path: "/equipment",
    element: (
      <ProtectedRoute>
        <Equipment />
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: <div>404 | Page not found.</div>,
  },
]);

export default router;
