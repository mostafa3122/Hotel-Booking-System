import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import forgetImg from "../../../assets/forget.png";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Link from "@mui/material/Link";
import {Link as RouterLink} from "react-router-dom";



interface ForgotPasswordFormData {
  email: string;
}

export default function ForgetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>();

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);

    try {
      await axios.post(
        "https://upskilling-egypt.com:3000/api/v0/portal/users/forgot-password",
        { email: data.email }
      );

      toast.success("Reset link sent! Please check your inbox.");
      navigate("/reset-password");
    } catch (err: unknown) {
      const message =
        axios.isAxiosError(err)
          ? err.response?.data?.message || "Something went wrong. Please try again."
          : "Something went wrong.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", height: "97vh", overflow: "hidden", bgcolor: "#fff" }}>

      {/* ── Left Panel ── */}
      <Box
        sx={{
          flex: "0 0 45%",
          display: "flex",
          flexDirection: "column",
          px: 3,
          py: 2,
          overflowY: "auto",
        }}
      >
        {/* Brand */}
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, color: "#1a1a2e", letterSpacing: "-0.5px", mb: 7 }}
        >
          <span style={{ color: "#1a6ef5" }}>Stay</span>cation.
        </Typography>

        {/* Form area */}
        <Box sx={{ maxWidth: 420, pl: 8, pt: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: "#1a1a2e", mb: 3 }}>
            Forgot password
          </Typography>

          <Typography variant="body2" sx={{ color: "#666", mb: 4, lineHeight: 1.7 }}>
            If you already have an account register
            <br />
            You can{" "}
            <Link component={RouterLink} to="/login" underline="hover" sx={{ color: "#1a6ef5", fontWeight: 600 }}>
              Login here !
            </Link>
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <Typography sx={{ fontWeight: 600 }}>Email</Typography>
            <TextField
              id="email"
              type="email"
              placeholder="Please type here ..."
              fullWidth
              error={!!errors.email}
              helperText={errors.email?.message}
              slotProps={{ inputLabel: { shrink: true } }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#f3f3f5",
                  borderRadius: "8px",
                  "& fieldset": { border: "none" },
                  "&:hover fieldset": { border: "none" },
                  "&.Mui-focused fieldset": { border: "none" },
                },
                "& .MuiOutlinedInput-input": {
                  padding: "9px 20px",
                  fontSize: "16px",
                },
                "& .MuiOutlinedInput-input::placeholder": {
                  color: "#c7c9d1",
                  opacity: 1,
                },
                "& .MuiInputLabel-root": { color: "#666" },
              }}
              {...register("email", {
                required: "Email is required.",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address.",
                },
              })}
            />

            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
              sx={{
                mt: 5,
                py: 1.4,
                bgcolor: "#1a6ef5",
                fontWeight: 600,
                fontSize: "14px",
                textTransform: "none",
                borderRadius: "6px",
                "&:hover": { bgcolor: "#3252DF" },
              }}
              startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : null}
            >
              {isLoading ? "Sending…" : "Send mail"}
            </Button>
          </Box>
        </Box>
      </Box>

      {/* ── Right Panel ── */}
      <Box
        sx={{
          flex: 1,
          borderRadius: "16px",
          overflow: "hidden",
          mr: 2,
          ml: -20,
        }}
      >
        <Box
          component="img"
          src={forgetImg}
          alt="Forgot password"
          sx={{
            width: "70%",
            height: "100%",
            objectFit: "cover",
            backgroundPosition: "center",
            display: "block",
            ml: 35,
            borderRadius: "16px",
          }}
        />
      </Box>
    </Box>
  );
}