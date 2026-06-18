import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Footer from "../../shared/userSharedComponent/Footer/Footer";
import Navbar from "../../shared/userSharedComponent/Navbar/Navbar";
export default function UserLayout() {
  return (
    <Box>
      <Navbar />

      <Box sx={{ minHeight: "80vh" }}>
        <Outlet />
      </Box>

      <Footer />
    </Box>
  );
}
