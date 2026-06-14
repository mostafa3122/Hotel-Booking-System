import { useContext } from "react";
import { Drawer, Box, List, ListItem, ListItemButton, ListItemIcon, Typography, IconButton } from "@mui/material";
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
import { useTranslation } from 'react-i18next';


interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

export default function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
    const { t, i18n } = useTranslation();
    const isRtl = i18n.language.startsWith('ar');

    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const menuItems = [
        { text: t("Home"), icon: <HomeOutlinedIcon />, path: "/dashboard" },
        { text: t("Users"), icon: <PeopleOutlinedIcon />, path: "/dashboard/users" },
        { text: t("Rooms"), icon: <GridViewOutlinedIcon />, path: "/dashboard/rooms" },
        { text: t("Ads"), icon: <CalendarMonthOutlinedIcon />, path: "/dashboard/ads" },
        { text: t("Bookings"), icon: <PeopleOutlinedIcon />, path: "/dashboard/bookings" },
        { text: t("Facilities"), icon: <PrecisionManufacturingOutlinedIcon />, path: "/dashboard/facilities" },
        { text: t("Change password"), icon: <LockOutlinedIcon />, path: "/change-password" },
    ];

    const currentWidth = isCollapsed ? { xs: "70px", sm: "85px" } : "260px";

    return (
        <Drawer
            variant="permanent"
            anchor={isRtl ? "right" : "left"}
            sx={{
                width: currentWidth,
                flexShrink: 0,
                transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "& .MuiDrawer-paper": {
                    width: currentWidth,
                    boxSizing: "border-box",
                    bgcolor: "#203FC7",
                    color: "white",
                    border: "none",
                    overflowX: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    py: 3,
                    transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    boxShadow: isRtl ? "-4px 0 25px rgba(0, 0, 0, 0.05)" : "4px 0 25px rgba(0, 0, 0, 0.05)",
                },
            }}
        >
       
            <Box
                sx={{
                    display: "flex",
                    justifyContent: isCollapsed ? "center" : "flex-end",
                    alignItems: "center",
                    px: isCollapsed ? 1 : 3,
                    mb: 3,
                    minHeight: "40px",
                }}
            >
               
                <IconButton
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    sx={{
                        color: "white",
                        bgcolor: "rgba(255, 255, 255, 0.1)",
                        borderRadius: "8px",
                        p: 0.8,
                        "&:hover": {
                            bgcolor: "rgba(255, 255, 255, 0.2)",
                        },
                    }}
                >
                    {isCollapsed ? (
                        isRtl ? <KeyboardDoubleArrowLeftIcon sx={{ fontSize: "20px" }} /> : <KeyboardDoubleArrowRightIcon sx={{ fontSize: "20px" }} />
                    ) : (
                        isRtl ? <KeyboardDoubleArrowRightIcon sx={{ fontSize: "20px" }} /> : <KeyboardDoubleArrowLeftIcon sx={{ fontSize: "20px" }} />
                    )}
                </IconButton>
            </Box>

           
            <List sx={{ display: "flex", flexDirection: "column", gap: 0.5, px: 0 }}>
                {menuItems.map((item, index) => (
                    <ListItem key={index} disablePadding>
                        <ListItemButton
                            component={NavLink}
                            to={item.path}
                            end={item.path === "/dashboard"}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                                px: isCollapsed ? { xs: 2.5, sm: 3.5 } : { xs: 2.5, md: 4 },
                                py: 1.5,
                                color: "rgba(255, 255, 255, 0.7)",
                                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                                justifyContent: isCollapsed ? "center" : "flex-start",
                                borderLeft: "4px solid transparent",
                                "&:hover": {
                                    color: "white",
                                    bgcolor: "rgba(255, 255, 255, 0.08)",
                                },
                                "&.active": {
                                    color: "white",
                                    bgcolor: "rgba(0, 0, 0, 0.15)",
                                    borderLeft: "4px solid white",
                                    pl: isCollapsed ? { xs: 2, sm: 3 } : { xs: 2, md: 3.5 },
                                },
                            }}
                        >
                            <ListItemIcon 
                                sx={{ 
                                    color: "inherit", 
                                    minWidth: "auto", 
                                    display: "flex", 
                                    "& svg": { fontSize: "22px" } 
                                }}
                            >
                                {item.icon}
                            </ListItemIcon>

                            {!isCollapsed && (
                                <Typography
                                    sx={{
                                        fontFamily: "Poppins",
                                        fontSize: "15px",
                                        fontWeight: 500,
                                        lineHeight: 1,
                                    }}
                                >
                                    {item.text}
                                </Typography>
                            )}
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>

           
            <Box
                onClick={handleLogout}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    px: isCollapsed ? { xs: 2.5, sm: 3.5 } : { xs: 2.5, md: 4 },
                    py: 1.8,
                    color: "rgba(255, 255, 255, 0.7)",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    justifyContent: isCollapsed ? "center" : "flex-start",
                    mt: "auto",
                    borderLeft: "4px solid transparent",
                    "&:hover": {
                        color: "#EA5455",
                        bgcolor: "rgba(234, 84, 85, 0.1)",
                    },
                }}
            >
                <ListItemIcon 
                    sx={{ 
                        color: "inherit", 
                        minWidth: "auto", 
                        display: "flex", 
                        "& svg": { fontSize: "22px" } 
                    }}
                >
                    <LogoutIcon />
                </ListItemIcon>
                {!isCollapsed && (
                    <Typography
                        sx={{
                            fontFamily: "Poppins",
                            fontSize: "15px",
                            fontWeight: 500,
                            lineHeight: 1,
                        }}
                    >
                        {t("Logout")}
                    </Typography>
                )}
            </Box>
        </Drawer>
    );
}