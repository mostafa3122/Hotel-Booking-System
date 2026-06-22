import { useState, useContext, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Avatar,
  Badge,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Menu,
  MenuItem,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";

import { AuthContext } from "../../../context/AuthContext";

import avatar from "../../../assets/avatar.png";
import CustomButton from "../../components/CustomButton/CustomButton";
import { useFavorites } from "../../../context/Favoritescontext";

const NAV_LINKS = [
  { to: "/", label: "Home", icon: HomeOutlinedIcon, authOnly: false },
  { to: "/explore", label: "Explore", icon: ExploreOutlinedIcon, authOnly: false },
  { to: "/reviews", label: "Reviews", icon: StarBorderOutlinedIcon, authOnly: true },
  { to: "/favorites", label: "Favorites", icon: FavoriteBorderOutlinedIcon, authOnly: true },
];

// ── Desktop nav link — adds active highlighting + underline, fixes the
// default MUI Button uppercase transform, and optionally shows a badge
// (used for the live favorites counter). ─────────────────────────────────────
function NavItem({ to, label, badgeCount }: { to: string; label: string; badgeCount?: number }) {
  const location = useLocation();
  const isActive = to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  return (
    <Button
      component={NavLink}
      to={to}
      sx={{
        position: "relative",
        textTransform: "none",
        fontSize: 14,
        fontWeight: isActive ? 700 : 500,
        color: isActive ? "#3252DF" : "#1F263E",
        px: 1.8,
        borderRadius: 1.5,
        "&:hover": { color: "#3252DF", bgcolor: "rgba(50,82,223,0.06)" },
        "&::after": {
          content: '""',
          position: "absolute",
          bottom: 4,
          left: "50%",
          width: "55%",
          height: 2,
          borderRadius: 2,
          bgcolor: "#3252DF",
          transform: isActive ? "translateX(-50%) scaleX(1)" : "translateX(-50%) scaleX(0)",
          transition: "transform 0.2s ease",
        },
        "&:hover::after": { transform: "translateX(-50%) scaleX(1)" },
      }}
    >
      {badgeCount !== undefined ? (
        <Badge
          badgeContent={badgeCount}
          color="error"
          sx={{
            "& .MuiBadge-badge": {
              right: -10,
              top: -6,
              fontSize: 10,
              height: 16,
              minWidth: 16,
              padding: "0 4px",
            },
          }}
        >
          {label}
        </Badge>
      ) : (
        label
      )}
    </Button>
  );
}

// ── Mobile drawer link — same active-state logic, with a leading icon
// (also carrying the badge, when provided). ──────────────────────────────────
function MobileNavItem({
  to,
  label,
  Icon,
  onClick,
  badgeCount,
}: {
  to: string;
  label: string;
  Icon: React.ElementType;
  onClick: () => void;
  badgeCount?: number;
}) {
  const location = useLocation();
  const isActive = to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  return (
    <ListItem disablePadding>
      <ListItemButton
        component={NavLink}
        to={to}
        onClick={onClick}
        selected={isActive}
        sx={{
          borderRadius: 1.5,
          mb: 0.3,
          "&.Mui-selected": { bgcolor: "rgba(50,82,223,0.08)" },
          "&.Mui-selected:hover": { bgcolor: "rgba(50,82,223,0.12)" },
        }}
      >
        <ListItemIcon sx={{ minWidth: 34, color: isActive ? "#3252DF" : "#8A92A6" }}>
          {badgeCount !== undefined ? (
            <Badge
              badgeContent={badgeCount}
              color="error"
              sx={{ "& .MuiBadge-badge": { right: -4, top: -2, fontSize: 9, height: 14, minWidth: 14 } }}
            >
              <Icon sx={{ fontSize: 20 }} />
            </Badge>
          ) : (
            <Icon sx={{ fontSize: 20 }} />
          )}
        </ListItemIcon>
        <ListItemText
          primary={
            <Typography
              sx={{
                fontSize: 14,
                fontWeight: isActive ? 700 : 500,
                color: isActive ? "#3252DF" : "#1F263E",
              }}
            >
              {label}
            </Typography>
          }
        />
      </ListItemButton>
    </ListItem>
  );
}

export default function PublicNavbar() {
  const { token, userData, logout } = useContext(AuthContext);
  const { favoriteCount } = useFavorites();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [scrolled, setScrolled] = useState(false);

  const toggleDrawer = () => setOpen((prev) => !prev);
  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  // Subtle shadow once the page scrolls, so the bar feels "lifted" off content.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const profileImageSrc = userData?.profileImage
    ? userData.profileImage.startsWith("http")
      ? userData.profileImage
      : `https://upskilling-egypt.com:3000/${userData.profileImage}`
    : avatar;

  const visibleLinks = NAV_LINKS.filter((link) => !link.authOnly || token);

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          top: 0,
          bgcolor: "white",
          color: "#152C5B",
          borderBottom: scrolled ? "1px solid transparent" : "1px solid #E5E5E5",
          boxShadow: scrolled ? "0 6px 24px -12px rgba(20,16,60,0.18)" : "none",
          transition: "box-shadow 0.25s ease, border-color 0.25s ease",
        }}
      >
        <Toolbar
          sx={{
            maxWidth: "1200px",
            mx: "auto",
            width: "100%",
          }}
        >
          {/* Logo */}
          <Typography
            component={Link}
            to="/"
            sx={{
              textDecoration: "none",
              fontWeight: 700,
              fontSize: "28px",
              color: "#3252DF",
              transition: "opacity 0.15s ease",
              "&:hover": { opacity: 0.85 },
            }}
          >
            Staycation.
          </Typography>

          {/* Links */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              ml: "auto",
              alignItems: "center",
            }}
          >
            {visibleLinks.map((link) => (
              <NavItem
                key={link.to}
                to={link.to}
                label={link.label}
                badgeCount={link.label === "Favorites" ? favoriteCount : undefined}
              />
            ))}
          </Box>

          {/* Auth */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: 2,
              ml: 2,
            }}
          >
            {!token ? (
              <>
                <CustomButton text="Register" size="small" variant="primary" to="/auth/register" />
                <CustomButton text="Login" size="small" variant="primary" to="/auth/login" />
              </>
            ) : (
              <>
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
                    transition: "background-color 0.2s ease-in-out",
                    "&:hover": {
                      bgcolor: "rgba(32, 63, 199, 0.05)",
                    },
                  }}
                >
                  <Avatar
                    src={profileImageSrc}
                    sx={{
                      width: 38,
                      height: 38,
                      border: "2px solid #E2E5EB",
                    }}
                  />

                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontWeight: 500,
                      color: "#1F263E",
                      maxWidth: 140,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {userData?.userName}
                  </Typography>

                  <KeyboardArrowDownIcon
                    sx={{
                      color: "#8A92A6",
                      fontSize: "18px",
                      transition: "transform 0.2s ease",
                      transform: anchorEl ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  />
                </Box>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleCloseMenu}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  slotProps={{
                    paper: {
                      sx: {
                        mt: 1,
                        minWidth: 190,
                        borderRadius: 2,
                        boxShadow: "0 12px 32px -12px rgba(20,16,60,0.25)",
                        border: "1px solid #EFEDF8",
                      },
                    },
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      navigate("/dashboard/profile");
                      handleCloseMenu();
                    }}
                    sx={{ fontSize: 14, py: 1.1 }}
                  >
                    <PersonOutlinedIcon sx={{ fontSize: 18, mr: 1.2, color: "#1976d2" }} />
                    Profile
                  </MenuItem>

                  <Divider />

                  <MenuItem
                    onClick={() => {
                      logout();
                      handleCloseMenu();
                    }}
                    sx={{ fontSize: 14, py: 1.1, color: "#EA5455" }}
                  >
                    <LogoutIcon sx={{ fontSize: 18, mr: 1.2, color: "#EA5455" }} />
                    Logout
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>

          {/* Mobile Menu Button */}
          <IconButton
            onClick={toggleDrawer}
            aria-label="Open navigation menu"
            sx={{ display: { xs: "flex", md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={open} onClose={toggleDrawer} transitionDuration={300}>
        <Box sx={{ width: 280, height: "100%", display: "flex", flexDirection: "column" }}>
          {/* Drawer header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 2,
              py: 1.8,
            }}
          >
            <Typography sx={{ fontWeight: 700, fontSize: 20, color: "#3252DF" }}>
              Staycation.
            </Typography>
            <IconButton onClick={toggleDrawer} aria-label="Close navigation menu" size="small">
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          <Divider />

          {/* Mini profile card for logged-in users */}
          {token && (
            <Box
              onClick={() => {
                navigate("/dashboard/profile");
                toggleDrawer();
              }}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.4,
                px: 2,
                py: 1.6,
                cursor: "pointer",
                "&:hover": { bgcolor: "rgba(50,82,223,0.05)" },
              }}
            >
              <Avatar src={profileImageSrc} sx={{ width: 44, height: 44, border: "2px solid #E2E5EB" }} />
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#1F263E", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {userData?.userName}
                </Typography>
                <Typography sx={{ fontSize: 12, color: "#8A92A6" }}>View profile</Typography>
              </Box>
            </Box>
          )}

          <Divider sx={{ mb: 1 }} />

          <List sx={{ px: 1, flex: 1 }}>
            {visibleLinks.map((link) => (
              <MobileNavItem
                key={link.to}
                to={link.to}
                label={link.label}
                Icon={link.icon}
                onClick={toggleDrawer}
                badgeCount={link.label === "Favorites" ? favoriteCount : undefined}
              />
            ))}

            <Divider sx={{ my: 1.5 }} />

            {!token ? (
              <>
                <ListItem disablePadding>
                  <ListItemButton component={Link} to="/auth/login" onClick={toggleDrawer} sx={{ borderRadius: 1.5 }}>
                    <ListItemIcon sx={{ minWidth: 34, color: "#8A92A6" }}>
                      <LoginOutlinedIcon sx={{ fontSize: 20 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
                          Login
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                  <ListItemButton component={Link} to="/auth/register" onClick={toggleDrawer} sx={{ borderRadius: 1.5 }}>
                    <ListItemIcon sx={{ minWidth: 34, color: "#8A92A6" }}>
                      <PersonAddAltOutlinedIcon sx={{ fontSize: 20 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
                          Register
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              </>
            ) : (
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => {
                    logout();
                    toggleDrawer();
                  }}
                  sx={{ borderRadius: 1.5 }}
                >
                  <ListItemIcon sx={{ minWidth: 34, color: "#EA5455" }}>
                    <LogoutIcon sx={{ fontSize: 20 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        sx={{
                          fontSize: 14,
                          fontWeight: 500,
                          color: "#EA5455",
                        }}
                      >
                        Logout
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
}