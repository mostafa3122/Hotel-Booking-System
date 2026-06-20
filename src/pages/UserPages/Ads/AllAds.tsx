import {
  Box,
  Card,
  Chip,
  Grid,
  Typography,
  Snackbar,
  Alert,
  IconButton,
  CircularProgress,
} from "@mui/material";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import axiosClient from "../../../services/api/axiosClient";
import FavoriteButton from "./FavoriteButton/FavoriteButton";

interface Ad {
  _id: string;
  isActive: boolean;
  room: {
    _id: string;
    roomNumber: string;
    price: number;
    capacity: number;
    discount: number;
    images: string[];
  };
  createdBy: {
    userName: string;
  };
}

export default function AllAds() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const [toast, setToast] = useState({
    open: false,
    message: "",
    type: "success" as "success" | "error" | "info" | "warning",
  });

  const isAuthenticated = Boolean(localStorage.getItem("token"));

  const showToast = (
    message: string,
    type: "success" | "error" | "info" | "warning" = "success"
  ) => {
    setToast({ open: true, message, type });
  };

  const handleViewClick = (roomId: string) => {
    navigate(`/room-details/${roomId}`);
  };

  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, open: false }));
  };

  // 📌 fetch ads
  useEffect(() => {
    const fetchAds = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get("/portal/ads");
        setAds(res?.data?.data?.ads?.slice(0, 5) || []);
      } catch {
        showToast("Failed to load ads", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, []);

 

 

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 6,
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography>Loading ads...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: "1400px", mx: "auto", px: 1, py: 10 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Ads Gallery
      </Typography>

      {!loading && ads.length === 0 && (
        <Typography>No ads found</Typography>
      )}

      <Grid container spacing={3}>
        {ads.map((ad) => (
          <Grid key={ad._id} size={{ xs: 12, sm: 6, md: 4, lg: 4 }}>
            <Card
              sx={{
                position: "relative",
                borderRadius: 3,
                overflow: "hidden",
                boxShadow: 4,
                cursor: "pointer",
                aspectRatio: "4 / 3",
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: 12,
                },
                "&:hover img": {
                  transform: "scale(1.1)",
                },
                "&:hover .hoverActions": {
                  opacity: 1,
                },
              }}
            >
              {/* Hover Actions */}
              <Box
                className="hoverActions"
                sx={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2,
                  opacity: 0,
                  transition: "0.3s",
                  zIndex: 3,
                }}
              >
                <FavoriteButton
                  roomId={ad.room._id}
                  isAuthenticated={isAuthenticated}
                  onSuccess={(msg) => showToast(msg, "success")}
                  onError={(msg) => showToast(msg, "error")}
                />

                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewClick(ad.room._id);
                  }}
                  sx={{
                    bgcolor: "rgba(255,255,255,0.2)",
                    color: "#fff",
                  }}
                >
                  <VisibilityIcon />
                </IconButton>
              </Box>

              {/* Image */}
              <img
                src={ad.room?.images?.[0] || "/placeholder.jpg"}
                alt="room"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "0.4s",
                }}
              />

              {/* overlay */}
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.75), transparent)",
                }}
              />

              {/* price */}
              <Typography
                sx={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  bgcolor: "rgba(255,64,129,0.9)",
                  color: "#fff",
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 2,
                  fontSize: 12,
                  fontWeight: "bold",
                }}
              >
                ${ad.room?.price}
              </Typography>

              {/* discount */}
              {ad.room?.discount > 0 && (
                <Chip
                  label={`${ad.room.discount}% OFF`}
                  color="error"
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 10,
                    left: 10,
                    fontWeight: "bold",
                  }}
                />
              )}

              {/* info */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: 12,
                  left: 12,
                  right: 12,
                  color: "#fff",
                }}
              >
                <Typography sx={{ fontWeight: 600 }}>
                  Room {ad.room?.roomNumber}
                </Typography>

                <Typography variant="body2">
                  {ad.createdBy?.userName}
                </Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Toast */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={toast.type} variant="filled">
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}