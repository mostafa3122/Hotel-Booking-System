import { useContext, useState } from "react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Navbar from "../../shared/components/Navbar/Navbar";
import Sidebar from "../../shared/components/Sidebar/Sidebar";
import { AuthContext } from "../../context/AuthContext";
export default function MasterLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const {userData} = useContext(AuthContext);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#F8F9FB" }}>
      {userData.role === "admin" && <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />}
      <Box
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3, md: 4 },
          display: "flex",
          flexDirection: "column",
          gap: 3,
          minWidth: 0,
          bgcolor: "white",
        }}
      >
        <Navbar />
        <Box component="main" sx={{ flexGrow: 1, minWidth: 0, width: "100%", overflow: "hidden" }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

