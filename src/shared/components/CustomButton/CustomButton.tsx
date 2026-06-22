import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { Link } from "react-router-dom";

interface CustomButtonProps {
  text: string;
    to?: string; 

  variant?: "primary" | "secondary";
  size?: "small" | "medium" | "large";
  width?: string;
  height?: string;
  padding?: string;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
}

export default function CustomButton({
  text,
  to,
  variant = "primary",
  size = "medium",
  width,
  height,
  padding,
  loading = false,
  disabled = false,
  onClick,
}: CustomButtonProps) {
  const buttonSizes = {
    small: {
      width: "120px",
      height: "36px",
      padding: "8px 16px",
    },
    medium: {
      width: "180px",
      height: "45px",
      padding: "10px 20px",
    },
    large: {
      width: "257px",
      height: "50px",
      padding: "12px 24px",
    },
  };

  const buttonVariants = {
    primary: {
      backgroundColor: "#3252DF",
      color: "#FFFFFF",
      boxShadow: "0px 4px 10px rgba(50, 82, 223, 0.3)",

      transition: "all 0.25s ease",

      "&:hover": {
        backgroundColor: "#2844C7",
        transform: "translateY(-2px)",
        boxShadow: "0px 8px 20px rgba(50, 82, 223, 0.4)",
      },

      "&:active": {
        transform: "translateY(0px)",
        boxShadow: "0px 4px 10px rgba(50, 82, 223, 0.3)",
      },
    },

    secondary: {
      backgroundColor: "#F5F5F7",
      color: "#BDBDBD",

      transition: "all 0.25s ease",

      "&:hover": {
        backgroundColor: "#ECECEC",
        transform: "translateY(-2px)",
        boxShadow: "0px 6px 15px rgba(0,0,0,0.08)",
      },

      "&:active": {
        transform: "translateY(0px)",
      },
    },
  };

  return (
    <Button
     component={to ? Link : "button"}
  to={to}
      disabled={disabled || loading}
      onClick={onClick}
      sx={{
        ...buttonVariants[variant],

        width: width || buttonSizes[size].width,
        height: height || buttonSizes[size].height,
        padding: padding || buttonSizes[size].padding,

        borderRadius: "5px",
        textTransform: "none",
        fontWeight: 500,
        fontSize: "16px",

        transition: "all 0.25s ease",
      }}
    >
      {loading ? (
        <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <CircularProgress size={18} sx={{ color: "#fff" }} />
          <span style={{ color: "#fff" }}>Loading...</span>
        </Box>
      ) : (
        text
      )}
    </Button>
  );
}