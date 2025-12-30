import { createBrowserRouter } from "react-router-dom";
import Home from "./Home";
import Employee from "../resources/employee/Employee";
import Equipment from "../resources/equipment/Equipment";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/employee", element: <Employee /> },
  { path: "/equipment", element: <Equipment /> },
  {
    path: "*",
    element: <div>404 | Página no encontrada</div>,
  },
]);

export default router;
