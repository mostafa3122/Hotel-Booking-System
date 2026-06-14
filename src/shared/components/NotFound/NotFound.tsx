import { Box, Button, Typography, keyframes } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LoginIcon from "@mui/icons-material/Login";
import { useNavigate } from "react-router-dom";

const float = keyframes`
  0%,100% { transform: translateY(0); }
  50%      { transform: translateY(-14px); }
`;
const fadeUp = keyframes`
  from { opacity:0; transform:translateY(24px); }
  to   { opacity:1; transform:translateY(0); }
`;
const slideL = keyframes`
  from { opacity:0; transform:translateX(-40px); }
  to   { opacity:1; transform:translateX(0); }
`;
const slideR = keyframes`
  from { opacity:0; transform:translateX(40px); }
  to   { opacity:1; transform:translateX(0); }
`;
const blink = keyframes`
  0%,100% { opacity:1; }
  50%      { opacity:0.2; }
`;
const doorOpen = keyframes`
  0%   { transform: scaleX(1) translateX(0); }
  100% { transform: scaleX(0) translateX(-50%); }
`;
const doorOpenR = keyframes`
  0%   { transform: scaleX(1) translateX(0); }
  100% { transform: scaleX(0) translateX(50%); }
`;
const windowLight = keyframes`
  0%,100% { background: #FAC775; }
  33%      { background: #EF9F27; }
  66%      { background: #FAC77588; }
`;
const moonGlow = keyframes`
  0%,100% { transform: scale(1); }
  50%      { transform: scale(1.08); }
`;
const cloudDrift = keyframes`
  0%   { transform: translateX(-30px); }
  100% { transform: translateX(30px); }
`;
const tagWiggle = keyframes`
  0%,100% { transform: rotate(-3deg); }
  50%      { transform: rotate(3deg); }
`;
const starTwinkle = keyframes`
  0%,100% { opacity:0.15; }
  50%      { opacity:0.7; }
`;

const WINDOWS = [
  [false, true, false, false],
  [true, false, true, false],
  [false, true, false, true],
  [true, false, true, false],
];

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        bgcolor: "#73bafc",
        px: 2,
        py: 5,
      }}
    >
      {/* Stars */}
      {[
        { top: "12%", left: "10%", delay: "0s" },
        { top: "8%", left: "35%", delay: "0.6s", size: 4 },
        { top: "20%", left: "70%", delay: "1.1s", color: "#FAC775", size: 4 },
        { top: "5%", left: "82%", delay: "1.8s" },
        { top: "28%", left: "92%", delay: "0.3s", size: 3 },
      ].map((s, i) => (
        <Box
          key={i}
          sx={{
            position: "absolute",
            top: s.top,
            left: s.left,
            width: s.size ?? 5,
            height: s.size ?? 5,
            borderRadius: "50%",
            bgcolor: s.color ?? "#378ADD",
            animation: `${starTwinkle} 2s ease-in-out ${s.delay} infinite`,
          }}
        />
      ))}

      {/* Moon */}
      <Box
        sx={{
          position: "absolute",
          top: 18,
          left: 80,
          width: 36,
          height: 36,
          borderRadius: "50%",
          bgcolor: "#FAC775",
          animation: `${moonGlow} 4s ease-in-out infinite`,
        }}
      />

      {/* Clouds */}
      {[
        { top: 30, left: 30, delay: "0s", scale: 1 },
        { top: 50, right: 40, delay: "-3s", scale: 0.7 },
        { top: 50, center: 40, delay: "-3s", scale: 0.7 },
      ].map((c, i) => (
        <Box
          key={i}
          sx={{
            position: "absolute",
            top: c.top,
            left: c.left,
            right: c.right,
            animation: `${cloudDrift} 6s ease-in-out ${c.delay} infinite alternate`,
            transform: `scale(${c.scale})`,
          }}
        >
          <Box
            sx={{
              width: 70,
              height: 28,
              borderRadius: "20px",
              bgcolor: "#B5D4F488",
              position: "relative",
              "&::before": {
                content: '""',
                position: "absolute",
                width: 36,
                height: 36,
                borderRadius: "50%",
                bgcolor: "#B5D4F488",
                top: -16,
                left: 12,
              },
            }}
          />
        </Box>
      ))}

      {/* Hotel */}
      <Box
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          mb: 1,
          animation: `${float} 4s ease-in-out infinite`,
          width: 220,
          height: 200,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: -24,
            right: -18,
            bgcolor: "#FAC775",
            color: "#633806",
            fontSize: 10,
            fontWeight: 500,
            px: "8px",
            py: "4px",
            borderRadius: "4px",
            border: "0.5px solid #EF9F27",
            animation: `${tagWiggle} 2s ease-in-out infinite`,
            zIndex: 3,
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: -6,
              left: "50%",
              transform: "translateX(-50%)",
              borderLeft: "6px solid transparent",
              borderRight: "6px solid transparent",
              borderTop: "6px solid #FAC775",
            },
          }}
        >
          Room not found
        </Box>

        <Box
          sx={{
            width: 180,
            height: 170,
            bgcolor: "#185FA5",
            borderRadius: "4px 4px 0 0",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 14,
              bgcolor: "#0C447C",
              borderRadius: "4px 4px 0 0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              sx={{
                fontSize: 9,
                color: "#85B7EB",
                fontWeight: 500,
                letterSpacing: 1,
              }}
            >
              GRAND HOTEL
            </Typography>
          </Box>

          <Box sx={{ mt: "20px" }}>
            {WINDOWS.map((row, ri) => (
              <Box
                key={ri}
                sx={{
                  display: "flex",
                  gap: "10px",
                  justifyContent: "center",
                  py: "4px",
                }}
              >
                {row.map((off, wi) => (
                  <Box
                    key={wi}
                    sx={{
                      width: 22,
                      height: 22,
                      borderRadius: "2px",
                      bgcolor: off ? "#0C447C" : "#FAC775",
                      animation: off
                        ? "none"
                        : `${windowLight} 3s ease-in-out ${wi * 0.4}s infinite`,
                    }}
                  />
                ))}
              </Box>
            ))}
          </Box>

          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: 40,
              height: 52,
              bgcolor: "#0C447C",
              borderRadius: "3px 3px 0 0",
              overflow: "hidden",
              display: "flex",
            }}
          >
            <Box
              sx={{
                width: "50%",
                height: "100%",
                bgcolor: "#1D9E75",
                transformOrigin: "left",
                animation: `${doorOpen} 1.2s ease-in-out 1s both`,
              }}
            />
            <Box
              sx={{
                width: "50%",
                height: "100%",
                bgcolor: "#1D9E75",
                transformOrigin: "right",
                animation: `${doorOpenR} 1.2s ease-in-out 1s both`,
              }}
            />
          </Box>

          <Box
            sx={{
              position: "absolute",
              bottom: 8,
              left: "50%",
              transform: "translateX(-50%)",
              bgcolor: "#E24B4A",
              color: "#FCEBEB",
              fontSize: 11,
              fontWeight: 500,
              px: "10px",
              py: "3px",
              borderRadius: "20px",
              whiteSpace: "nowrap",
              animation: `${fadeUp} 0.5s ease 2.2s both`,
              zIndex: 3,
            }}
          >
            🔒 Unavailable
          </Box>
        </Box>
      </Box>

      {/* 404 */}
      <Box sx={{ display: "flex", alignItems: "center", gap: "6px", mb: 0.5 }}>
        {["4", "0", "4"].map((d, i) => (
          <Typography
            key={i}
            sx={{
              fontSize: 80,
              fontWeight: 700,
              lineHeight: 1,
              color: i === 1 ? "#378ADD" : "#185FA5",
              animation:
                i === 0
                  ? `${slideL} 0.5s ease 0.1s both`
                  : i === 2
                    ? `${slideR} 0.5s ease 0.1s both`
                    : `${blink} 3s ease-in-out infinite`,
            }}
          >
            {d}
          </Typography>
        ))}
      </Box>

      <Typography
        variant="h5"
        sx={{
          fontWeight: 600,
          color: "#185FA5",
          animation: `${fadeUp} 0.6s ease 0.5s both`,
        }}
      >
        Room Not Found
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          textAlign: "center",
          maxWidth: 300,
          mt: 0.5,
          mb: 3,
          lineHeight: 1.7,
          animation: `${fadeUp} 0.6s ease 0.7s both`,
        }}
      >
        This page doesn't exist or the room has been removed.
        <br />
        Go back or sign in to your account.
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 1.5,
          animation: `${fadeUp} 0.6s ease 0.9s both`,
        }}
      >
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{
            textTransform: "none",
            fontWeight: 500,
            borderRadius: 2,
            bgcolor: "#185FA5",
            "&:hover": { bgcolor: "#0C447C" },
          }}
        >
          Go Back
        </Button>
        <Button
          variant="outlined"
          startIcon={<LoginIcon />}
          onClick={() => navigate("/login")}
          sx={{
            textTransform: "none",
            fontWeight: 500,
            borderRadius: 2,
            borderColor: "divider",
            color: "text.primary",
            "&:hover": { bgcolor: "action.hover" },
          }}
        >
          Sign In
        </Button>
      </Box>
    </Box>
  );
}
