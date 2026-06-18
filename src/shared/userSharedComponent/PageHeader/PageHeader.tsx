import { Box, Breadcrumbs, Link, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

interface PageHeaderProps {
  title: string;
}

export default function PageHeader({ title }: PageHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // split current path
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 3,
      }}
    >
      {/* Left Breadcrumb */}
      <Breadcrumbs>
        <Link
          underline="hover"
          color="inherit"
          onClick={() => navigate("/home")}
          sx={{ cursor: "pointer" }}
        >
          Home
        </Link>

        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;

          return (
            <Link
              key={routeTo}
              underline="hover"
              color="text.primary"
              onClick={() => navigate(routeTo)}
              sx={{ cursor: "pointer" }}
            >
              {name}
            </Link>
          );
        })}
      </Breadcrumbs>

      {/* Center Title */}
      <Typography variant="h5"  sx={{ fontWeight: "bold" }}>
        {title}
      </Typography>

      {/* Spacer (for symmetry) */}
      <Box sx={{ width: 120 }} />
    </Box>
  );
}
