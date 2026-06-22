import { useContext, useState } from "react";
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Typography,
  IconButton,
} from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import PrecisionManufacturingOutlinedIcon from "@mui/icons-material/PrecisionManufacturingOutlined";
import { AuthContext } from "../../../context/AuthContext";
import { useTranslation } from "react-i18next";
import ConfirmationDialog from "../ConfirmationDialog/ConfirmationDialog";
import logoutImg from "../../../assets/logout.png";
import logo from "../../../assets/Logo.svg";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

export default function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language.startsWith("ar");

  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

  const menuItems = [
    { text: t("Home"), icon: <HomeOutlinedIcon />, path: "/dashboard" },
    {
      text: t("Users"),
      icon: <PeopleOutlinedIcon />,
      path: "/dashboard/users",
    },
    {
      text: t("Rooms"),
      icon: <GridViewOutlinedIcon />,
      path: "/dashboard/rooms",
    },
    {
      text: t("Ads"),
      icon: <CalendarMonthOutlinedIcon />,
      path: "/dashboard/ads",
    },
    {
      text: t("Bookings"),
      icon: <PeopleOutlinedIcon />,
      path: "/dashboard/bookings",
    },
    {
      text: t("Facilities"),
      icon: <PrecisionManufacturingOutlinedIcon />,
      path: "/dashboard/facilities",
    },
    {
      text: t("Change password"),
      icon: <LockOutlinedIcon />,
      path: "/auth/change-password",
    },
  ];

  const currentWidth = isCollapsed ? { xs: "70px", sm: "85px" } : "260px";

  const handleLogout = () => {
    logout();
    navigate("/login");
    setOpenLogoutDialog(false);
  };

  return (
    <>
      <Drawer
        variant="permanent"
        anchor={isRtl ? "right" : "left"}
        sx={{
          width: currentWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: currentWidth,
            bgcolor: "#203FC7",
            color: "white",
            border: "none",
            display: "flex",
            flexDirection: "column",
            py: 3,
            transition: "width 0.3s ease",
            boxShadow: isRtl
              ? "-4px 0 25px rgba(0,0,0,0.05)"
              : "4px 0 25px rgba(0,0,0,0.05)",
          },
        }}
      >
      
        <Box
          sx={{
            display: "flex",
            justifyContent: isCollapsed ? "center" : "space-between",
            alignItems: "center",
            px: 2,
            mb: 3,
          }}
        >

          <IconButton
            onClick={() => setIsCollapsed(!isCollapsed)}
            sx={{ color: "white" }}
          >
            {isCollapsed ? (
              isRtl ? (
                <KeyboardDoubleArrowLeftIcon />
              ) : (
                <KeyboardDoubleArrowRightIcon />
              )
            ) : isRtl ? (
              <KeyboardDoubleArrowRightIcon />
            ) : (
              <KeyboardDoubleArrowLeftIcon />
            )}
          </IconButton>
        </Box>

        {/* MENU */}
        <List sx={{ flex: 1 }}>
          {menuItems.map((item, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton
                component={NavLink}
                to={item.path}
                end={item.path === "/dashboard"}
                sx={{
                  justifyContent: isCollapsed ? "center" : "flex-start",
                  color: "rgba(255,255,255,0.7)",
                  "&.active": {
                    color: "white",
                    bgcolor: "rgba(0,0,0,0.2)",
                  },
                }}
              >
                <ListItemIcon sx={{ color: "inherit", minWidth: 0 }}>
                  {item.icon}
                </ListItemIcon>

                {!isCollapsed && (
                  <Typography sx={{ ml: 2 }}>{item.text}</Typography>
                )}
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Box
          onClick={() => setOpenLogoutDialog(true)}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: isCollapsed ? "center" : "flex-start",
            px: 2,
            py: 2,
            cursor: "pointer",
            mt: "auto",
            "&:hover": { color: "#EA5455" },
          }}
        >
          <LogoutIcon />
          {!isCollapsed && (
            <Typography sx={{ ml: 2 }}>{t("Logout")}</Typography>
          )}
        </Box>
      </Drawer>

   
      <ConfirmationDialog
        open={openLogoutDialog}
        onClose={() => setOpenLogoutDialog(false)}
        onConfirm={handleLogout}
        image={logoutImg}
        title={t("Logout")}
        message={t("Are you sure you want to logout from your account?")}
        confirmText={t("Logout")}
        loadingText={t("Logging out...")}
      />
    </>
  );
}
