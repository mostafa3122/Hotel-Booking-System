import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Navbar from "../../shared/components/Navbar/Navbar";
import Sidebar from "../../shared/components/Sidebar/Sidebar";

export default function MasterLayout() {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "green" }}>
      <Sidebar />
      <Box
        sx={{
          flexGrow: 1,
          ml: { xs: "70px", sm: "85px" },
          p: { xs: 2, sm: 3, md: 4 },
          display: "flex",
          flexDirection: "column",
          gap: 3,
          minWidth: 0,
          bgcolor: "pink",
        }}
      >
        <Navbar />
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

