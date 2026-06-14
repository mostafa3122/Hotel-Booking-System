import { useState, useContext } from "react";
import {
  Box,
  IconButton,
  InputBase,
  Badge,
  Avatar,
  Typography,
  Menu,
  MenuItem,
  Divider,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";

import { AuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import avatar from "../../../assets/avatar.png";
import logoutImg from "../../../assets/logout.png";
import ConfirmationDialog from "../ConfirmationDialog/ConfirmationDialog";

import { useTranslation } from "react-i18next";

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language.startsWith("ar");

  const { userData, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openLogout, setOpenLogout] = useState(false);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = () => {
    const nextLang = isRtl ? "en" : "ar";
    i18n.changeLanguage(nextLang);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    setOpenLogout(false);
    handleCloseMenu();
  };

  const handleOpenLogoutDialog = () => {
    setOpenLogout(true);
    handleCloseMenu();
  };

  
  const handleGoToProfile = () => {
    handleCloseMenu();
    navigate("/dashboard/profile"); 
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          height: "72px",
          bgcolor: "#F8F9FB",
          borderRadius: "16px",
          px: 3,
          border: "1px solid #F1F5F9",
        }}
      >
     
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            bgcolor: "white",
            borderRadius: "30px",
            px: 2,
            py: 0.8,
            width: { xs: "180px", sm: "300px", md: "350px" },
            border: "1px solid #F1F5F9",
          }}
        >
          <SearchIcon
            sx={{
              color: "#1F263E",
              mr: isRtl ? 0 : 1.2,
              ml: isRtl ? 1.2 : 0,
              fontSize: 20,
            }}
          />
          <InputBase
            placeholder={t("searchHere")}
            sx={{
              fontSize: 14,
              width: "100%",
              "& input::placeholder": {
                color: "#8A92A6",
                opacity: 1,
              },
            }}
          />
        </Box>


            <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1.5, sm: 2 } }}>
                {/* PROFILE */}
                <Box
                    onClick={handleOpenMenu}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.2,
                        cursor: "pointer",
                        p: 0.5,
                        pr: 1.5,
                        borderRadius: "30px",
                        transition: "all 0.2s ease-in-out",
                        "&:hover": {
                            bgcolor: "rgba(32, 63, 199, 0.05)",
                        },
                    }}
                >
                    <Avatar
                        src={
                            userData?.profileImage 
                                ? (userData.profileImage.startsWith("http") 
                                    ? userData.profileImage 
                                    : `https://upskilling-egypt.com:3000/${userData.profileImage}`) 
                                : avatar
                        }
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
                            {userData?.userName || "Upskilling"}
                        </Typography>
                    </Box>
                    <KeyboardArrowDownIcon sx={{ color: "#8A92A6", fontSize: "18px" }} />
                </Box>

                {/* LANGUAGE */}
                <Button
                  onClick={handleLanguageChange}
                  sx={{
                    fontFamily: "Poppins",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#203FC7",
                    bgcolor: "rgba(32, 63, 199, 0.06)",
                    textTransform: "none",
                    borderRadius: "30px",
                    px: 2.2,
                    minWidth: "48px",
                    height: "38px",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      bgcolor: "rgba(32, 63, 199, 0.12)",
                    },
                  }}
                >
                  {isRtl ? "EN" : "AR"}
                </Button>

                
                <IconButton
                  sx={{
                    color: "#1F263E",
                    bgcolor: "white",
                    border: "1px solid #F1F5F9",
                    width: "38px",
                    height: "38px",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      bgcolor: "#F8F9FB",
                      borderColor: "#E2E8F0",
                    },
                  }}
                >
                  <Badge
                    variant="dot"
                    color="error"
                    sx={{
                      "& .MuiBadge-badge": {
                        width: 8,
                        height: 8,
                        backgroundColor: "#EA5455",
                      },
                    }}
                  >
                    <NotificationsNoneOutlinedIcon sx={{ fontSize: "20px" }} />
                  </Badge>
                </IconButton>
            </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
          transformOrigin={{
            horizontal: isRtl ? "left" : "right",
            vertical: "top",
          }}
          anchorOrigin={{
            horizontal: isRtl ? "left" : "right",
            vertical: "bottom",
          }}
          slotProps={{
            paper: {
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 8px 30px rgba(0, 0, 0, 0.08))",
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
                  py: 1.2,
                  px: 2.5,
                  gap: 1.5,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: "#F8FAFC",
                  },
                },
              },
            },
          }}
        >
          
          <MenuItem onClick={handleGoToProfile}>
            <PersonOutlinedIcon sx={{ fontSize: 18, mr: 1, color: "#1976d2" }} />
            <Typography sx={{ fontSize: 14 }}>{t("profile")}</Typography>
          </MenuItem>

          <Divider sx={{ my: "4px !important", borderColor: "#F1F5F9" }} />

          <MenuItem onClick={handleOpenLogoutDialog} sx={{ color: "#EA5455" }}>
            <LogoutIcon sx={{ fontSize: 18, mr: 1 }} />
            <Typography sx={{ fontSize: 14 }}>{t("logout")}</Typography>
          </MenuItem>
        </Menu>
      </Box>

      <ConfirmationDialog
        open={openLogout}
        onClose={() => setOpenLogout(false)}
        onConfirm={handleLogout}
        title={t("logout")}
        message={t("confirmLogout")}
        image={logoutImg}
        confirmText={t("logout")}
        loadingText={t("loggingOut")}
      />
    </>
  );
}