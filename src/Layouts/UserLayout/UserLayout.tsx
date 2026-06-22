import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Footer from "../../shared/userSharedComponent/Footer/Footer";
import PublicNavbar from "../../shared/userSharedComponent/Navbar/PuplicNavbar";
export default function UserLayout() {
  return (
    <Box>
      
      <PublicNavbar/>

      <Box sx={{ minHeight: "80vh" }}>
        <Outlet />
      </Box>
     <Footer/>
    </Box>
  );
}
