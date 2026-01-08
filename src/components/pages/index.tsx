import { createHashRouter } from "react-router-dom";
import Home from "./Home";
import Employee from "../resources/employee/Employee";
import Equipment from "../resources/equipment/Equipment";

const router = createHashRouter([
  { path: "/", element: <Home /> },
  { path: "/employee", element: <Employee /> },
  { path: "/equipment", element: <Equipment /> },
  {
    path: "*",
    element: <div>404 | Page not found.</div>,
  },
]);

export default router;
