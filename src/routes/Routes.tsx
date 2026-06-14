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
import Dashboard from "../pages/Admin/Dashboard/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import ChangePassword from "../pages/Auth/ChangePassword/ChangePassword";
import Test from "../shared/Test";
import Rooms from "../pages/Admin/Rooms/Rooms";
import AddRoom from "../pages/Admin/Rooms/AddRoom";
import RoomDetails from "../pages/Admin/Rooms/RoomDetails";
import EditRoom from "../pages/Admin/Rooms/EditRoom";
import AdsList from "../pages/Admin/Ads/AdsList/AdsList";
import Booking from "../pages/Admin/Booking/Booking";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      { index: true, element: <Navigate to="/login" replace /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "forget-password", element: <ForgetPassword /> },
      { path: "reset-password", element: <ResetPassword /> },
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
      { path: "test-rooms", element: <Test/> },
      { path: "rooms", element: <Rooms/> },
      { path: "rooms/add", element: <AddRoom /> },
      { path: "rooms/:id/edit", element: <EditRoom /> },
      { path: "rooms/:id", element: <RoomDetails /> },
      { path: "rooms", element: <Test/> },
      { path: "ads", element: <AdsList/> },
      { path: "bookings", element: <Booking/> },
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
