import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import AuthLayout from "../Layouts/AuthLayout/AuthLayout";
import MasterLayout from "../Layouts/MasterLayout/MasterLayout";
import AdsList from "../pages/Admin/Ads/AdsList/AdsList";
import Booking from "../pages/Admin/Booking/Booking";
import Dashboard from "../pages/Admin/Dashboard/Dashboard";
import AddRoom from "../pages/Admin/Rooms/AddRoom";
import EditRoom from "../pages/Admin/Rooms/EditRoom";
import RoomDetails from "../pages/Admin/Rooms/RoomDetails";
import Rooms from "../pages/Admin/Rooms/Rooms";
import ChangePassword from "../pages/Auth/ChangePassword/ChangePassword";
import ForgetPassword from "../pages/Auth/ForgetPassword/ForgetPassword";
import Login from "../pages/Auth/Login/Login";
import Register from "../pages/Auth/Register/Register";
import ResetPassword from "../pages/Auth/ResetPassword/ResetPassword";
import Test from "../shared/Test";
import ProtectedRoute from "./ProtectedRoute";

import FacilitiesList from "../pages/Admin/Facilities/FacilitiesList/FacilitiesList";
import ProfilePage from "../pages/Admin/ProfilePage/ProfilePage";
import UsersList from "../pages/Admin/Users/UsersList/UsersList";
import NotFound from "../shared/components/NotFound/NotFound";
import UserLayout from "../Layouts/UserLayout/UserLayout";
import Home from "../pages/UserPages/Home/Home";
import Explore from "../pages/UserPages/Explore/Explore";
import Favorites from "../pages/UserPages/Favorites/Favorites";
import RoomData from "../pages/UserPages/RoomData/RoomData";
import BookingPayment from "../pages/UserPages/BookingPayment/BookingPayment";

const router = createBrowserRouter([
  // User routes
  {
    path: "/",
    element: <UserLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: "home", element: <Home /> },
      { path: "explore", element: <Explore /> },
      { path: "favorites", element: <Favorites /> },
      { path: "room-details/:id", element: <RoomData /> },
      { path: "bookingPayment", element: <BookingPayment /> },
    ],
  },
  // auth routes
  {
    path: "auth",
    element: <AuthLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Login /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "forget-password", element: <ForgetPassword /> },
      { path: "reset-password", element: <ResetPassword /> },
      { path: "change-password", element: <ChangePassword /> },
    ],
  },
  // admin routes
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <MasterLayout />
      </ProtectedRoute>
    ),
    errorElement: <NotFound />,

    children: [
      { index: true, element: <Dashboard /> },
      { path: "test-rooms", element: <Test /> },
      { path: "rooms", element: <Rooms /> },
      { path: "rooms/add", element: <AddRoom /> },
      { path: "rooms/:id/edit", element: <EditRoom /> },
      { path: "rooms/:id", element: <RoomDetails /> },
      { path: "bookings", element: <Booking /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "ads", element: <AdsList /> },
      { path: "facilities", element: <FacilitiesList /> },
      { path: "users", element: <UsersList /> },
    ],
  },
]);

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}
