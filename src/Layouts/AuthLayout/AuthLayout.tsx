import { Box, Grid, Typography } from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";
import RegisterImg from "../../assets/Rectangle 7.png";
import LoginImg from "../../assets/login.svg";
import ForgetImg from "../../assets/forget.svg";
import ResetImg from "../../assets/forget.svg";
import ChangeImg from "../../assets/ChangePassword.svg";
import Logo from "../../assets/Logo.svg";

const renderImg = (pathname: string) => {
  if (pathname === "/auth/register") return RegisterImg;
  if (pathname === "/auth/login") return LoginImg;
  if (pathname === "/auth/reset-password") return ResetImg;
  if (pathname === "/auth/change-password") return ChangeImg;
  return ForgetImg;
};

export default function AuthLayout() {
  const { pathname } = useLocation();

  return (
    <Grid
      container
      sx={{ minHeight: "100vh", width: "100%" }}
      columns={{ xs: 6, sm: 12 }}
    >
      {/* Left: Form */}
      <Grid size={6} sx={{ height: "100%" }}>
        <Box
          component="img"
          src={Logo}
          alt="Logo"
          sx={{ mt: { md: "0.7rem" }, ml: { md: "3rem", xs: "2rem" } }}
        />
        <Outlet />
      </Grid>

      {/* Right: Image — sticky so it fills the viewport as you scroll */}
      <Grid
        size={6}
        sx={{
          display: { xs: "none", sm: "block" },
          position: "sticky",
          top: 0,
          height: "100vh",
          p: "12px",
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "100%",
            borderRadius: "16px",
            overflow: "hidden",
          }}
        >
          {/* الصورة */}
          <Box
            component="img"
            src={renderImg(pathname)}
            alt="auth illustration"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />

          {/* Overlay */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(23, 33, 33, 0.35)",
            }}
          />

          {/* text */}
          <Box
            sx={{
              position: "absolute",
              bottom: "2rem",
              left: "50%",
              transform: "translateX(-50%)",
              width: "90%",
              color: "white",
              textAlign: "center",
            }}
          >
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                fontSize: { sm: "1.6rem", md: "2rem", lg: "2.5rem" },
                whiteSpace: "normal",
                wordBreak: "break-word",
              }}
            >
              {pathname === "/auth/register" && "Sign up to Roamhome"}
              {pathname === "/auth/login" && "Sign in to Roamhome"}
              {pathname === "/auth/forget-password" && "Forgot Password"}
              {pathname === "/auth/reset-password" && "Reset Password"}
              {pathname === "/auth/change-password" && "Change Password"}
            </Typography>
            <Typography variant="body1" sx={{ fontSize: "1.1rem", mt: 0.5 }}>
              Homes as unique as you.
            </Typography>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
