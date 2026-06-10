import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import axiosClient from "../../../services/api/axiosClient";
import { API_ENDPOINTS } from "../../../config/api";

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
import { inputStyles } from "../../../shared/inputStyles";
import { Link as RouterLink } from "react-router-dom";
import { toast } from "react-toastify";

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
      await axiosClient.post(
        API_ENDPOINTS.RESET_PASSWORD,
        {
          email: data.email,
          password: data.password,
          confirmPassword: data.confirmPassword,
          seed: data.otp,
        }
      );

      setSuccessMsg("Password reset successfully! You can now login.");
      toast.success("Password reset successfully! You can now login.");
      navigate("/login");
    } catch (err: unknown) {
      let msg = "Something went wrong.";
      if (axios.isAxiosError(err)) {
        msg = err.response?.data?.message || "Bad request. Please try again.";
      } else if (err instanceof Error) {
        msg = err.message;
      }
      setApiError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const fieldLabel = (label: string) => (
    <Typography sx={{ fontWeight: 600, mb: -1 }}>{label}</Typography>
  );

  return (
    <Box sx={{ mt: { md: '3rem', xs: '2rem' }, ml: { md: '5rem', xs: '2rem' }, mr: { md: '5rem', xs: '2rem' } }}>
      <Box sx={{ maxWidth: 420 }}>
        <Typography variant="h4" sx={{ color: "#000", fontWeight: 500, fontSize: "30px" }}>
          Reset Password
        </Typography>

        <Typography variant="body2" sx={{ color: "#666", mb: 2, lineHeight: 1.7 }}>
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
  );
}