import { useState } from "react";
import { useForm } from "react-hook-form";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import registerImage from "../../../assets/Rectangle 7.png";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

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

      const response = await axios.post(
        "https://upskilling-egypt.com:3000/api/v0/admin/users",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      toast.success(response.data.message);
      navigate("/login");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
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
        height: { xs: "auto", md: "100vh" },
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        px: { xs: 2, md: 6 },
        py: 4,
      }}
    >
      <Typography
        sx={{
          fontWeight: 700,
          fontSize: "28px",
          mb: 4,
          display: { xs: "none", md: "block" },
        }}
      >
        <Box component="span" sx={{ color: "#3252DF" }}>
          Stay
        </Box>
        <Box component="span" sx={{ color: "#152C5B" }}>
          cation.
        </Box>
      </Typography>
      <Grid container sx={{ flex: 1 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            sx={{
              height: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              px: 6,
              bgcolor: "#fff",
            }}
          >
            <Box sx={{ width: "100%", maxWidth: 420 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 600,
                  color: "#152C5B",
                  mb: 1,
                  fontSize: "28px",
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
                  href="/login"
                  underline="none"
                  sx={{ color: "#FF498B", fontWeight: 600 }}
                >
                  Login here !
                </Link>
              </Typography>

              <Box component="form" onSubmit={handleSubmit(onSubmit)}>
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
                                <Visibility
                                  sx={{ fontSize: 18, color: "#B0B7C3" }}
                                />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
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
                                <Visibility
                                  sx={{ fontSize: 18, color: "#B0B7C3" }}
                                />
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
                <Box sx={{ mb: 1.5 }}>
                  {fieldLabel("Profile Image")}

                  <input
                    type="file"
                    accept="image/*"
                    {...register("profileImage", {
                      required: "Profile Image is required",
                    })}
                  />

                  {errors.profileImage && (
                    <Typography color="error" sx={{ fontSize: 12 }}>
                      {errors.profileImage.message}
                    </Typography>
                  )}
                </Box>
                <Button
                  type="submit"
                  fullWidth
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
        </Grid>

        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{
            display: { xs: "none", md: "block" },
          }}
        >
          <Box
            sx={{
              height: "100vh",
              px: 3,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                width: "100%",
                height: "95%",
                borderRadius: "24px",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <Box
                component="img"
                src={registerImage}
                alt="Register"
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />

              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)",
                }}
              />

              <Box
                sx={{
                  position: "absolute",
                  left: 36,
                  bottom: 36,
                  color: "#fff",
                }}
              >
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 700, fontSize: "22px", mb: 0.5 }}
                >
                  Sign up to Roamhome
                </Typography>

                <Typography sx={{ fontSize: "14px", opacity: 0.9 }}>
                  Homes as unique as you.
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
