import { Box, Link, Typography, TextField, Button, CircularProgress, Alert, InputAdornment, IconButton } from "@mui/material";
import { useForm } from "react-hook-form";
import { Link as RouterLink } from "react-router-dom";
import { inputStyles } from "../../../shared/inputStyles";
import { useState } from "react";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";

import axios from "axios";
import { changePassword, type ChangePasswordFormData } from "../../../services/api/users";
import { toast } from "react-toastify";

export default function ChangePassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ChangePasswordFormData>();

  const onSubmit = async (data: ChangePasswordFormData) => {
    setIsLoading(true);
    setApiError(null);
    setSuccessMsg(null);

    try {
      await changePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });

      localStorage.removeItem("token");
      setSuccessMsg("Password changed successfully! you can login now");
    } catch (err: unknown) {
      let msg = "Something went wrong.";
      if (axios.isAxiosError(err)) {
        msg = err.response?.data?.message || "Bad request. Please try again.";
      } else if (err instanceof Error) {
        msg = err.message;
      }
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const fieldLabel = (label: string) => (
    <Typography sx={{ fontWeight: 400, color: "#152C5B", mb: -1, fontSize: "16px", lineHeight: "170%", fontFamily: "Poppins" }}>
      {label}
    </Typography>
  );

  return (
    <Box sx={{ mt: { md: '3rem', xs: '2rem' }, ml: { md: '5rem', xs: '2rem' }, mr: { md: '5rem', xs: '2rem' } }}>
      <Box sx={{ width: "100%", maxWidth: 430 }}>
        <Typography sx={{ fontWeight: 500, color: "#000", fontSize: "30px", mb: 2 }}>
          Change Password
        </Typography>

        {/* <Typography sx={{ color: "#000", mb: 2, lineHeight: 1.7, fontSize: "16px" }}>
          If you already have an account register
          <br />
          You can {" "}
          <Link component={RouterLink} to="/login" underline="hover" sx={{ color: "#EB5148", fontWeight: 600 }}>
            Login here !
          </Link>
        </Typography> */}

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          {/* Old Password */}
          {fieldLabel("Old Password")}
          <TextField
            id="oldPassword"
            type="password"
            placeholder="Please type here ..."
            fullWidth
            error={!!errors.oldPassword}
            helperText={errors.oldPassword?.message}
            sx={inputStyles}
            {...register("oldPassword", {
              required: "Old Password is required.",
              minLength: { value: 8, message: "At least 8 characters." },
            })}
          />

          {/* New Password */}
          {fieldLabel("New Password")}
          <TextField
            id="newPassword"
            type={showPassword ? "text" : "password"}
            placeholder="Please type here ..."
            size="small"
            fullWidth
            error={!!errors.newPassword}
            helperText={errors.newPassword?.message}
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
                      {showPassword ? <Visibility fontSize="small" /> : <VisibilityOff fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            {...register("newPassword", {
              required: "New Password is required.",
              minLength: { value: 8, message: "At least 8 characters." },
            })}
          />

          {/* Confirm Password */}
          {fieldLabel("Confirm Password")}
          <TextField
            id="confirmPassword"
            type={showConfirm ? "text" : "password"}
            placeholder="Please type here ..."
            size="small"
            fullWidth
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
                      {showConfirm ? <Visibility fontSize="small" /> : <VisibilityOff fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            {...register("confirmPassword", {
              required: "Please confirm your password.",
              validate: (value) =>
                value === watch("newPassword") || "Passwords do not match.",
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
            {isLoading ? "Changing…" : "Change"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
