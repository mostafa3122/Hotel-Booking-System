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
        {/* SEARCH */}
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

        {/* RIGHT SIDE */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* PROFILE */}
          <Box
            onClick={handleOpenMenu}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              cursor: "pointer",
              p: 0.5,
              borderRadius: "30px",
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
              sx={{ width: 38, height: 38, border: "2px solid #E2E5EB" }}
            />

            <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
              {userData?.userName || "Upskilling"}
            </Typography>

            <KeyboardArrowDownIcon sx={{ fontSize: 18, color: "#8A92A6" }} />
          </Box>

          {/* LANGUAGE */}
          <Button
            onClick={handleLanguageChange}
            sx={{
              fontSize: 14,
              fontWeight: 600,
              color: "#203FC7",
              bgcolor: "rgba(32,63,199,0.08)",
            }}
          >
            {isRtl ? "EN" : "AR"}
          </Button>

          {/* NOTIFICATION */}
          <IconButton>
            <Badge
              variant="dot"
              color="error"
              sx={{
                "& .MuiBadge-badge": {
                  width: 8,
                  height: 8,
                },
              }}
            >
              <NotificationsNoneOutlinedIcon />
            </Badge>
          </IconButton>
        </Box>

        {/* MENU */}
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
        >
          <MenuItem onClick={handleCloseMenu}>
            <PersonOutlinedIcon sx={{ fontSize: 18, mr: 1 }} />
            {t("profile")}
          </MenuItem>

          <Divider />

          <MenuItem onClick={handleOpenLogoutDialog} sx={{ color: "#EA5455" }}>
            <LogoutIcon sx={{ fontSize: 18, mr: 1 }} />
            {t("logout")}
          </MenuItem>
        </Menu>
      </Box>

      {/* CONFIRM DIALOG */}
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
