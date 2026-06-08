import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import AuthLayout from "../Layouts/AuthLayout/AuthLayout";
import MasterLayout from "../Layouts/MasterLayout/MasterLayout";
import Login from "../pages/Auth/Login/Login";
import Register from "../pages/Auth/Register/Register";
import ForgetPassword from "../pages/Auth/ForgetPassword/ForgetPassword";
import ResetPassword from "../pages/Auth/ResetPassword/ResetPassword";
import VerifyAccount from "../pages/Auth/VerifyAccount/VerifyAccount";
import Dashboard from "../pages/Admin/Dashboard/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import ChangePassword from "../pages/Auth/ChangePassword/ChangePassword";
const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      { index: true, element: <Login /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "forget-password", element: <ForgetPassword /> },
      { path: "reset-password", element: <ResetPassword /> },
      { path: "verify-account", element: <VerifyAccount /> },
      { path: "change-password", element: <ChangePassword /> },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <MasterLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/login" />,
  },
]);

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}
