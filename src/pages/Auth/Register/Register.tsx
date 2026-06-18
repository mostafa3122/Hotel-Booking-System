import { useState } from "react";
import { useForm } from "react-hook-form";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { AxiosError } from "axios";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { API_ENDPOINTS } from "../../../config/api";
import axiosClient from "../../../services/api/axiosClient";

import CloseIcon from "@mui/icons-material/Close";
import Avatar from "@mui/material/Avatar";

interface RegisterFormData {
  userName: string;
  phoneNumber: string;
  country: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  profileImage: FileList;
}

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);

    try {
      const formData = new FormData();

      formData.append("userName", data.userName);
      formData.append("phoneNumber", data.phoneNumber);
      formData.append("country", data.country);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("confirmPassword", data.confirmPassword);
      formData.append("role", "user");

      if (data.profileImage?.length > 0) {
        formData.append("profileImage", data.profileImage[0]);
      }

      const response = await axiosClient.post(
        API_ENDPOINTS.REGISTER,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(response.data.message || "Registration successful!");
      navigate("/auth/login");
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;

      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const profileImageRegister = register("profileImage", {
    required: "Profile Image is required",
  });
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImagePreview(null);
    setValue("profileImage", {} as FileList);
  };
  const fieldLabel = (label: string) => (
    <Typography
      sx={{ fontSize: "14px", fontWeight: 500, color: "#152C5B", mb: 0.5 }}
    >
      {label}
    </Typography>
  );

  const inputStyles = {
    "& .MuiOutlinedInput-root": {
      height: "45px",
      backgroundColor: "#F5F6FA",
      borderRadius: "4px",
      "& fieldset": { border: "none" },
      "&:hover fieldset": { border: "none" },
      "&.Mui-focused fieldset": { border: "1px solid #3252DF" },
    },

    "& .MuiOutlinedInput-input": {
      fontSize: "13px",
      "&::placeholder": { color: "#B0B7C3", opacity: 1 },
    },

    "& .MuiFormHelperText-root": {
      marginLeft: 0,
      fontSize: "11px",
    },
  };

  return (
    <Box
      sx={{
        mt: { md: "3rem", xs: "2rem" },
        ml: { md: "5rem", xs: "2rem" },
        mr: { md: "5rem", xs: "2rem" },
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 420 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 500,
            color: "#000",
            mb: 1,
            fontSize: "30px",
          }}
        >
          Sign up
        </Typography>

        <Typography sx={{ color: "#B0B7C3", fontSize: "14px" }}>
          If you already have an account register
        </Typography>

        <Typography sx={{ mb: 3, fontSize: "14px", color: "#152C5B" }}>
          You can{" "}
          <Link
            component={RouterLink}
            to="/auth/login"
            underline="none"
            sx={{ color: "#FF498B", fontWeight: 600 }}
          >
            Login here !
          </Link>
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          {/* Image  */}
          <Box sx={{ textAlign: "center", mb: 2 }}>
            {!imagePreview ? (
              <>
                <Button
                  component="label"
                  variant="outlined"
                  sx={{
                    borderStyle: "dashed",
                    borderWidth: 2,
                    py: 1.5,
                    px: 3,
                    borderRadius: 3,
                    textTransform: "none",
                  }}
                >
                  Upload Profile Image
                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    {...profileImageRegister}
                    onChange={(e) => {
                      profileImageRegister.onChange(e);
                      handleImageChange(e);
                    }}
                  />
                </Button>
              </>
            ) : (
              <Box
                sx={{
                  position: "relative",
                  width: 120,
                  mx: "auto",
                }}
              >
                <Avatar
                  src={imagePreview}
                  sx={{
                    width: 120,
                    height: 120,
                    mx: "auto",
                    border: "3px solid #3252DF",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  }}
                />

                <IconButton
                  onClick={removeImage}
                  size="small"
                  sx={{
                    position: "absolute",
                    top: -5,
                    right: -5,
                    width: 28,
                    height: 28,
                    bgcolor: "#ff4d4f",
                    color: "#fff",

                    "&:hover": {
                      bgcolor: "#d9363e",
                    },
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            )}
          </Box>
          {errors.profileImage && (
            <Typography
              color="error"
              sx={{ mt: 1, fontSize: 12, textAlign: "center" }}
            >
              {errors.profileImage.message}
            </Typography>
          )}
          {/* USERNAME */}
          <Box sx={{ mb: 1.5 }}>
            {fieldLabel("User Name")}
            <TextField
              fullWidth
              placeholder="Please type here ..."
              sx={inputStyles}
              error={!!errors.userName}
              helperText={errors.userName?.message}
              {...register("userName", {
                required: "User Name is required",
              })}
            />
          </Box>

          <Grid container spacing={1.5} sx={{ mb: 1.5 }}>
            <Grid size={6}>
              {fieldLabel("Phone Number")}
              <TextField
                fullWidth
                placeholder="Please type here ..."
                sx={inputStyles}
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber?.message}
                {...register("phoneNumber", {
                  required: "Phone Number is required",
                  pattern: {
                    value: /^01[0125][0-9]{8}$/,
                    message: "Please enter a valid Egyptian phone number",
                  },
                })}
              />
            </Grid>
            <Grid size={6}>
              {fieldLabel("Country")}
              <TextField
                fullWidth
                placeholder="Please type here ..."
                sx={inputStyles}
                error={!!errors.country}
                helperText={errors.country?.message}
                {...register("country", {
                  required: "Country is required",
                })}
              />
            </Grid>
          </Grid>

          <Box sx={{ mb: 1.5 }}>
            {fieldLabel("Email Address")}
            <TextField
              fullWidth
              placeholder="Please type here ..."
              sx={inputStyles}
              error={!!errors.email}
              helperText={errors.email?.message}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter valid email",
                },
              })}
            />
          </Box>

          <Box sx={{ mb: 1.5 }}>
            {fieldLabel("Password")}
            <TextField
              fullWidth
              type={showPassword ? "text" : "password"}
              placeholder="Please type here ..."
              sx={inputStyles}
              error={!!errors.password}
              helperText={errors.password?.message}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        size="small"
                      >
                        {showPassword ? (
                          <VisibilityOff
                            sx={{ fontSize: 18, color: "#B0B7C3" }}
                          />
                        ) : (
                          <Visibility sx={{ fontSize: 18, color: "#B0B7C3" }} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              {...register("password", {
                required: "Password is required",

                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },

                pattern: {
                  value:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])[A-Za-z\d@$!%*?&.#_-]{8,}$/,
                  message:
                    "Password must contain uppercase, lowercase, number and special character",
                },
              })}
            />
          </Box>

          <Box sx={{ mb: 1.5 }}>
            {fieldLabel("Confirm Password")}
            <TextField
              fullWidth
              type={showConfirm ? "text" : "password"}
              placeholder="Please type here ..."
              sx={inputStyles}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirm(!showConfirm)}
                        edge="end"
                        size="small"
                      >
                        {showConfirm ? (
                          <VisibilityOff
                            sx={{ fontSize: 18, color: "#B0B7C3" }}
                          />
                        ) : (
                          <Visibility sx={{ fontSize: 18, color: "#B0B7C3" }} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              {...register("confirmPassword", {
                required: "Confirm Password is required",
                validate: (value) =>
                  value === watch("password") || "Passwords do not match",
              })}
            />
          </Box>

          <Button
            type="submit"
            fullWidth
            disabled={isLoading}
            variant="contained"
            sx={{
              mt: 2,
              height: "48px",
              bgcolor: "#3252DF",
              borderRadius: "4px",
              textTransform: "none",
              fontSize: "16px",
              fontWeight: 500,
              boxShadow: "none",
              "&:hover": { bgcolor: "#2641c0", boxShadow: "none" },
            }}
          >
            {isLoading ? "Loading..." : "Sign up"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
