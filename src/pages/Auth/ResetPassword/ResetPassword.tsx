import { useState } from "react";
import { useForm } from "react-hook-form";
import resetImg from "../../../assets/reset.png";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Link from "@mui/material/Link";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { inputStyles } from "../../../sharedComponent/inputStyles";
import { useNavigate } from "react-router-dom";
interface ResetPasswordFormData {
  email: string;
  otp: string;
  password: string;
  confirmPassword: string;
}

interface ApiResponse {
  message?: string;
}

export default function ResetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>();

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    setApiError(null);
    setSuccessMsg(null);

    try {
      const response = await fetch("https://upskilling-egypt.com:3000/api/v0/portal/users/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          confirmPassword: data.confirmPassword,
          seed: data.otp,
        }),
      });

      const result: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Bad request. Please try again.");
      }

      setSuccessMsg("Password reset successfully! You can now login.");
      navigate("/login");
    } catch (err: unknown) {
      setApiError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fieldLabel = (label: string) => (
    <Typography sx={{ fontWeight: 600, mb: -1 }}>{label}</Typography>
  );

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
          // overflowY: "auto",
        }}
      >
        {/* Brand */}
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, color: "#1a1a2e", letterSpacing: "-0.5px", mb: 4 }}
        >
          <span style={{ color: "#1a6ef5" }}>Stay</span>cation.
        </Typography>

        {/* Form area */}
        <Box sx={{ maxWidth: 420, pl: 8}}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: "#1a1a2e", mb: 2 }}>
            Reset Password
          </Typography>

          <Typography variant="body2" sx={{ color: "#666", mb: 2, lineHeight: 1.7 }}>
            If you already have an account register
            <br />
            You can{" "}
            <Link href="/login" underline="hover" sx={{ color: "#1a6ef5", fontWeight: 600 }}>
              Login here !
            </Link>
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            {/* Email */}
            {fieldLabel("Email")}
           <TextField
              id="email"
              type="email"
              placeholder="Please type here ..."
              error={!!errors.email}
              helperText={errors.email?.message}
              sx={inputStyles}
              {...register("email", {
                required: "Email is required.",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address.",
                },
              })}
            />

            {/* OTP */}
            {fieldLabel("OTP")}
            <TextField
              id="otp"
              type="text"
              placeholder="Please type here ..."
              size="small"
              error={!!errors.otp}
              helperText={errors.otp?.message}
              slotProps={{ inputLabel: { shrink: true } }}
              sx={inputStyles}
              {...register("otp", {
                required: "OTP is required.",
              })}
            />

            {/* Password */}
            {fieldLabel("Password")}
            <TextField
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Please type here ..."
              size="small"
              error={!!errors.password}
              helperText={errors.password?.message}
              sx={inputStyles}
              slotProps={{
                inputLabel: { shrink: true },
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setShowPassword((p) => !p)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              {...register("password", {
                required: "Password is required.",
                minLength: { value: 6, message: "At least 6 characters." },
              })}
            />

            {/* Confirm Password */}
            {fieldLabel("Confirm Password")}
            <TextField
              id="confirmPassword"
              type={showConfirm ? "text" : "password"}
              placeholder="Please type here ..."
              size="small"
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              sx={inputStyles}
              slotProps={{
                inputLabel: { shrink: true },
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setShowConfirm((p) => !p)}
                        edge="end"
                      >
                        {showConfirm ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              {...register("confirmPassword", {
                required: "Please confirm your password.",
                validate: (value) =>
                  value === watch("password") || "Passwords do not match.",
              })}
            />

            {apiError && <Alert severity="error">{apiError}</Alert>}
            {successMsg && <Alert severity="success">{successMsg}</Alert>}

            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
              sx={{
                mt: 2,
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
              {isLoading ? "Resetting…" : "Reset"}
            </Button>
          </Box>
        </Box>
      </Box>

      {/* ── Right Panel — image ── */}
      <Box
        sx={{
          flex: 1,
          borderRadius: "16px",
          overflow: "hidden",
          mr: 2,
          ml: -11,
        }}
      >
        <Box
          component="img"
          src={resetImg}
          alt="Reset password"
          sx={{
            width: "70%",
            height: "100%",
            objectFit: "cover",
            backgroundPosition: "center",
            display: "block",
            ml: 30,
            borderRadius: "16px",
          }}
        />
      </Box>
    </Box>
  );
}