import { Box, Container, Typography, Link, Divider } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const linkStyle = {
    color: "#757575",
    fontSize: "0.85rem",
    transition: "all 0.25s ease",
    position: "relative",
    "&:hover": {
      color: "#1565C0",
      transform: "translateX(5px)",
    },
  };

  return (
    <Box
      component="footer"
      sx={{
        borderTop: "1px solid #e0e0e0",
        mt: 6,
        pt: 6,
        backgroundColor: "#fff",
      }}
    >
      <Container maxWidth="lg">

        {/* 🧱 Main Content */}
        <Box
          sx={{
            display: "flex",
            gap: 5,
            flexWrap: "wrap",
          }}
        >

          {/* 🟦 Brand */}
          <Box sx={{ flex: 2, minWidth: 220 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                mb: 1,
                color: "#1a1a1a",
                transition: "0.3s",
                "&:hover": {
                  letterSpacing: "1px",
                },
              }}
            >
              <Box component="span" sx={{ color: "#1565C0" }}>
                Stay
              </Box>
              cation.
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "#757575",
                lineHeight: 1.8,
                fontSize: "0.9rem",
              }}
            >
              We make your stay simple, fast and memorable.
            </Typography>
          </Box>

          {/* 🟩 For Beginners */}
          <Box sx={{ flex: 1, minWidth: 170 }}>
            <Typography sx={{ fontWeight: 700, mb: 2, color: "#1a1a1a" }}>
              For Beginners
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Link component={RouterLink} to="/register" sx={linkStyle}>
                New Account
              </Link>

              <Link component={RouterLink} to="/dashboard/bookings" sx={linkStyle}>
                Start Booking a Room
              </Link>

              <Link component={RouterLink} to="/dashboard/profile" sx={linkStyle}>
                Use Payments
              </Link>
            </Box>
          </Box>

          {/* 🟧 Explore Us */}
          <Box sx={{ flex: 1, minWidth: 170 }}>
            <Typography sx={{ fontWeight: 700, mb: 2, color: "#1a1a1a" }}>
              Explore Us
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Link component={RouterLink} to="/dashboard/users" sx={linkStyle}>
                Our Careers
              </Link>

              <Link component={RouterLink} to="/forget-password" sx={linkStyle}>
                Privacy
              </Link>

              <Link component={RouterLink} to="/dashboard" sx={linkStyle}>
                Terms & Conditions
              </Link>
            </Box>
          </Box>

          {/* 🟥 Contact */}
          <Box sx={{ flex: 1, minWidth: 200 }}>
            <Typography sx={{ fontWeight: 700, mb: 2, color: "#1a1a1a" }}>
              Connect Us
            </Typography>

            <Typography sx={{ color: "#757575", mb: 1 }}>
              support@staycation.id
            </Typography>

            <Typography sx={{ color: "#757575", mb: 1 }}>
              021 - 2208 - 1996
            </Typography>

            <Typography sx={{ color: "#757575" }}>
              Staycation, Kemang, Jakarta
            </Typography>
          </Box>

        </Box>

        {/* 🔵 Divider */}
        <Divider sx={{ my: 4 }} />

        {/* 🧾 Copyright */}
        <Typography
          align="center"
          sx={{
            color: "#9e9e9e",
            fontSize: "0.8rem",
            transition: "0.3s",
            "&:hover": {
              color: "#1565C0",
              letterSpacing: "0.5px",
            },
          }}
        >
          Copyright {currentYear} • All rights reserved • Staycation
        </Typography>

      </Container>
    </Box>
  );
}