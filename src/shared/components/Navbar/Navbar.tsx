import { useState, useContext } from "react";
import { Box, IconButton, InputBase, Badge, Avatar, Typography, Menu, MenuItem, Divider } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import avatar from "../../../assets/avatar.png";
import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';

export default function Navbar() {
      const { t, i18n } = useTranslation();
    const isRtl = i18n.language.startsWith('ar');
    const { userData, logout } = useContext(AuthContext);
    console.log("Navbar userData:", userData);
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);


    const handleLanguageChange = () => {
        const nextLang = i18n.language.startsWith('ar') ? 'en' : 'ar';
        i18n.changeLanguage(nextLang);
    };

    const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
        handleCloseMenu();
    };

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                height: "72px",
                bgcolor: "#F8F9FB",
                borderRadius: "16px",
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.03)",
                px: 3,
                border: "1px solid #F1F5F9",
                boxSizing: "border-box",
            
            }}
        >

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "white",
                    borderRadius: "30px",
                    px: 2,
                    py: 0.8,
                    width: { xs: "180px", sm: "300px", md: "350px" },
                    border: "1px solid #F1F5F9",
                    transition: "all 0.3s ease",
                    "&:focus-within": {
                        borderColor: "#D1E4FF",
                        backgroundColor: "white",
                        boxShadow: "0 0 0 3px rgba(32, 63, 199, 0.05)",
                    },
                }}
            >
                <SearchIcon sx={{ color: "#1F263E", mr: isRtl ? 0 : 1.2, ml: isRtl ? 1.2 : 0, fontSize: "20px" }} />
                <InputBase
                    placeholder={t('searchHere')}
                    sx={{
                        fontFamily: "Poppins",
                        fontSize: "14px",
                        color: "#1F263E",
                        width: "100%",
                        "& .MuiInputBase-input": {
                            padding: 0,
                            "&::placeholder": {
                                color: "#8A92A6",
                                opacity: 1,
                            },
                        },
                    }}
                />
            </Box>


            <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1.5, sm: 2.5 } }}>

                <Box
                    onClick={handleOpenMenu}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.2,
                        cursor: "pointer",
                        p: 0.5,
                        borderRadius: "30px",
                        transition: "all 0.2s ease",
                        "&:hover": {
                            bgcolor: "#F8F9FB",
                        },
                    }}
                >
                    <Avatar
                        src={avatar}
                        alt="Profile Avatar"
                        sx={{
                            width: 38,
                            height: 38,
                            border: "2px solid #E2E5EB",
                        }}
                    />
                    <Box sx={{ display: { xs: "none", sm: "block" } }}>
                        <Typography
                            sx={{
                                fontFamily: "Poppins",
                                fontSize: "14px",
                                fontWeight: 500,
                                color: "#1F263E",
                                lineHeight: 1.2,
                            }}
                        >
                            {userData?.userName  || "Upskilling"}
                        </Typography>
                    </Box>
                    <KeyboardArrowDownIcon sx={{ color: "#8A92A6", fontSize: "18px" }} />
                </Box>


                <Divider orientation="vertical" flexItem sx={{ my: 1.5, borderColor: "#E2E8F0" }} />

                <Button
                    onClick={handleLanguageChange}
                    sx={{
                        fontFamily: "Poppins",
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#203FC7",
                        textTransform: "uppercase",
                        minWidth: "auto",
                        px: 1.5,
                        py: 0.5,
                        borderRadius: "8px",
                        bgcolor: "rgba(32, 63, 199, 0.08)",
                        "&:hover": {
                            bgcolor: "rgba(32, 63, 199, 0.15)",
                        }
                    }}
                >
                    {i18n.language.startsWith('ar') ? 'EN' : 'AR'}
                </Button>

                <IconButton
                    sx={{
                        color: "#1F263E",
                        bgcolor: "#F8F9FB",
                        p: 1.2,
                        borderRadius: "50%",
                        border: "1px solid #F1F5F9",
                        "&:hover": {
                            bgcolor: "#F1F5F9",
                        },
                    }}
                >
                    <Badge
                        variant="dot"
                        color="error"
                        overlap="circular"
                        sx={{
                            "& .MuiBadge-badge": {
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                backgroundColor: "#EA5455",
                            },
                        }}
                    >
                        <NotificationsNoneOutlinedIcon sx={{ fontSize: "22px" }} />
                    </Badge>
                </IconButton>


                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleCloseMenu}
                    slotProps={{
                        paper: {
                            elevation: 0,
                            sx: {
                                overflow: "visible",
                                filter: "drop-shadow(0px 4px 20px rgba(0, 0, 0, 0.08))",
                                borderRadius: "12px",
                                mt: 1.5,
                                border: "1px solid #F1F5F9",
                                minWidth: "160px",
                                "& .MuiList-root": {
                                    py: 0.5,
                                },
                                "& .MuiMenuItem-root": {
                                    fontFamily: "Poppins",
                                    fontSize: "14px",
                                    fontWeight: "400",
                                    color: "#1F263E",
                                    py: 1,
                                    px: 2,
                                    gap: 1.5,
                                    "&:hover": {
                                        backgroundColor: "#F8FAFC",
                                    },
                                },
                            },
                        },
                    }}
                    transformOrigin={{ horizontal: isRtl ? "left" : "right", vertical: "top" }}
                    anchorOrigin={{ horizontal: isRtl ? "left" : "right", vertical: "bottom" }}
                >
                    <MenuItem onClick={handleCloseMenu}>
                        <PersonOutlinedIcon sx={{ fontSize: "18px", color: "#8A92A6" }} />
                        {t('profile')}
                    </MenuItem>
                    <Divider sx={{ my: "4px !important", borderColor: "#F1F5F9" }} />
                    <MenuItem onClick={handleLogout} sx={{ color: "#EA5455 !important" }}>
                        <LogoutIcon sx={{ fontSize: "18px", color: "#EA5455" }} />
                        {t('Logout')}
                    </MenuItem>
                </Menu>
            </Box>
        </Box>
    );
}