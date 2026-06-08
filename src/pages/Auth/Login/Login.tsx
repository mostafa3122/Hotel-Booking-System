import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import loginImg from "../../../assets/login.svg";

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

import axios from "axios";
import { loginUser, type LoginFormData } from "../../../services/api/users";
import { toast } from "react-toastify";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const { saveUserData } = useContext(AuthContext);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setApiError(null);

    try {
      const result = await loginUser({ email: data.email, password: data.password });
      
      const token = result.token || result.data?.token;

      if (!token) {
        throw new Error("No token received from server.");
      }

      localStorage.setItem("token", token);
      saveUserData();
      toast.success("Logged in successfully!");
      navigate("/dashboard");
    } catch (err: unknown) {
      let msg = "Something went wrong.";
      if (axios.isAxiosError(err)) {
        msg = err.response?.data?.message || "Invalid email or password.";
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
    <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, height: "100vh", bgcolor: "#fff", p: "22px" }}>
   
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <Typography
          sx={{ fontWeight: 500, color: "#152C5B", letterSpacing: "-0.5px", mb: 4, fontSize: "26px" }}
        >
          <span style={{ color: "#3252DF" }}>Stay</span>cation.
        </Typography>

      
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Box sx={{ width: "100%", maxWidth: 430 }}>
            <Typography sx={{ fontWeight: 500, color: "#000", fontSize: "30px", mb: 2 }}>
              Sign in
            </Typography>

            <Typography sx={{ color: "#000", mb: 2, lineHeight: 1.7, fontSize: "16px" }}>
              If you don't have an account register
              <br />
              You can{" "}
              <Link component={RouterLink} to="/register" underline="hover" sx={{ color: "#152C5B", fontWeight: 600 }}>
                Register here !
              </Link>
            </Typography>

            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              sx={{ display: "flex", flexDirection: "column", gap: 2, mb: "20px" }}
            >
              {fieldLabel("Email Address")}
              <TextField
                id="email"
                type="email"
                placeholder="Please type here ..."
                fullWidth
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

              {fieldLabel("Password")}
              <TextField
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Please type here ..."
                fullWidth
                error={!!errors.password}
                helperText={errors.password?.message}
                sx={inputStyles}
                slotProps={{
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
                {...register("password", {
                  required: "Password is required.",
                  minLength: { value: 6, message: "Password must be at least 6 characters." },
                })}
              />

              <Link
                component={RouterLink}
                to="/forget-password"
                underline="hover"
                sx={{
                  alignSelf: "flex-end",
                  color: "#4D4D4D",
                  fontWeight: 300,
                  fontSize: "12px",
                  mt: -0.5,
                }}
              >
                Forgot Password ?
              </Link>

              {apiError && <Alert severity="error">{apiError}</Alert>}

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
                {isLoading ? "Logging in…" : "Login"}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ── Right Panel — image ── */}
      <Box
        sx={{
          display: { xs: "none", md: "block" },
          width: "735px",
          height: "100%",
          borderRadius: "15px",
          overflow: "hidden",
          position: "relative",
          flexShrink: 0,
          ml: "22px",
        }}
      >
        <Box
          component="img"
          src={loginImg}
          alt="Login Page"
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />

        <Box
          sx={{
            position: "absolute",
            bottom: "40px",
            left: "40px",
            color: "#ffffff",
            zIndex: 2,
            maxWidth: "80%",
          }}
        >
          <Typography sx={{ fontWeight: 600, mb: 1, fontSize: "40px", fontFamily: "Poppins" }}>
            Sign in to Roamhome
          </Typography>
          <Typography sx={{ boxShadow: "0px 4px 4px 0px #00000040", fontSize: "20px", fontFamily: "Poppins" }}>
            Homes as unique as you.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
