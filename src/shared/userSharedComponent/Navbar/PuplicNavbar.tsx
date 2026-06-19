import { useState, useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Avatar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
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

import { AuthContext } from "../../../context/AuthContext";
import avatar from "../../../assets/avatar.png";

export default function PublicNavbar() {
  const { token, userData, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const toggleDrawer = () => setOpen(!open);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          bgcolor: "white",
          color: "#152C5B",
          borderBottom: "1px solid #E5E5E5",
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
            <Button component={NavLink} to="/">
              Home
            </Button>

            <Button component={NavLink} to="/explore">
              Explore
            </Button>

            {token && (
              <>
                <Button component={NavLink} to="/reviews">
                  Reviews
                </Button>

                <Button component={NavLink} to="/favorites">
                  Favorites
                </Button>
              </>
            )}
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
                <Button
                  component={Link}
                  to="/auth/register"
                  variant="contained"
                >
                  Register
                </Button>

                <Button
                  component={Link}
                  to="/auth/login"
                  variant="contained"
                >
                  Login
                </Button>
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
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      bgcolor: "rgba(32, 63, 199, 0.05)",
                    },
                  }}
                >
                  <Avatar
                    src={
                      userData?.profileImage
                        ? userData.profileImage.startsWith("http")
                          ? userData.profileImage
                          : `https://upskilling-egypt.com:3000/${userData.profileImage}`
                        : avatar
                    }
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
                    }}
                  >
                    {userData?.userName}
                  </Typography>

                  <KeyboardArrowDownIcon
                    sx={{
                      color: "#8A92A6",
                      fontSize: "18px",
                    }}
                  />
                </Box>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleCloseMenu}
                  anchorOrigin={{
                    horizontal: "right",
                    vertical: "bottom",
                  }}
                  transformOrigin={{
                    horizontal: "right",
                    vertical: "top",
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      navigate("/dashboard/profile");
                      handleCloseMenu();
                    }}
                  >
                    <PersonOutlinedIcon
                      sx={{
                        fontSize: 18,
                        mr: 1,
                        color: "#1976d2",
                      }}
                    />
                    Profile
                  </MenuItem>

                  <Divider />

                  <MenuItem
                    onClick={() => {
                      logout();
                      handleCloseMenu();
                    }}
                  >
                    <LogoutIcon
                      sx={{
                        fontSize: 18,
                        mr: 1,
                        color: "#EA5455",
                      }}
                    />
                    Logout
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>

          {/* Mobile Menu Button */}
          <IconButton
            onClick={toggleDrawer}
            sx={{ display: { xs: "flex", md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={open}
        onClose={toggleDrawer}
        transitionDuration={400}
      >
        <Box
          sx={{
            width: 260,
            p: 2,
          }}
        >
          <IconButton onClick={toggleDrawer}>
            <CloseIcon />
          </IconButton>

          <Divider sx={{ mb: 2 }} />

          <List>
            <ListItem disablePadding>
              <ListItemButton component={NavLink} to="/" onClick={toggleDrawer}>
                <ListItemText primary="Home" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                component={NavLink}
                to="/explore"
                onClick={toggleDrawer}
              >
                <ListItemText primary="Explore" />
              </ListItemButton>
            </ListItem>

            {token && (
              <>
                <ListItem disablePadding>
                  <ListItemButton
                    component={NavLink}
                    to="/reviews"
                    onClick={toggleDrawer}
                  >
                    <ListItemText primary="Reviews" />
                  </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                  <ListItemButton
                    component={NavLink}
                    to="/favorites"
                    onClick={toggleDrawer}
                  >
                    <ListItemText primary="Favorites" />
                  </ListItemButton>
                </ListItem>
              </>
            )}

            <Divider sx={{ my: 2 }} />

            {!token ? (
              <>
                <ListItem disablePadding>
                  <ListItemButton
                    component={Link}
                    to="/auth/login"
                    onClick={toggleDrawer}
                  >
                    <ListItemText primary="Login" />
                  </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                  <ListItemButton
                    component={Link}
                    to="/auth/register"
                    onClick={toggleDrawer}
                  >
                    <ListItemText primary="Register" />
                  </ListItemButton>
                </ListItem>
              </>
            ) : (
              <>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => {
                      navigate("/dashboard/profile");
                      toggleDrawer();
                    }}
                  >
                    <ListItemText primary="Profile" />
                  </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => {
                      logout();
                      toggleDrawer();
                    }}
                  >
                    <ListItemText primary="Logout" />
                  </ListItemButton>
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
}