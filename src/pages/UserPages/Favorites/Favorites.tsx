import { useEffect, useState } from "react";
import {
  Box,
  Card,
  Chip,
  Grid,
  Paper,
  Typography,
  Snackbar,
  Alert,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";

import axiosClient from "../../../services/api/axiosClient";
import cardImage from "../../../assets/card.png";
import PageHeader from "../../../shared/userSharedComponent/PageHeader/PageHeader";


import axios from "axios";
import RemoveFavoriteButton from "../Ads/FavoriteButton/RemoveFavoriteButton";
import { useFavorites } from "../../../context/Favoritescontext";

interface Room {
  _id: string;
  roomNumber: string;
  price: number;
  capacity: number;
  discount: number;
  images: string[];
}

export default function Favorites() {
  const [favoriteRooms, setFavoriteRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { refreshFavoriteCount } = useFavorites();

  const [toast, setToast] = useState({
    open: false,
    message: "",
    type: "success" as "success" | "error" | "info" | "warning",
  });

  const showToast = (
    message: string,
    type: "success" | "error" | "info" | "warning" = "success"
  ) => {
    setToast({ open: true, message, type });
  };

  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, open: false }));
  };

  const handleViewClick = (roomId: string) => {
    navigate(`/room-details/${roomId}`);
  };

  const getFavoriteRooms = async () => {
    try {
      setLoading(true);

      const response = await axiosClient.get("/portal/favorite-rooms");

      setFavoriteRooms(response.data.data.favoriteRooms?.[0]?.rooms || []);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data?.message);
      } else {
        console.log("Unexpected error", error);
      }
    } finally {
      setLoading(false);
    }
  };

  // remove waits for the server response before updating the UI,
  // so the room only disappears once it's actually deleted
  const handleRemoveSuccess = (roomId: string, msg: string) => {
    setFavoriteRooms((prev) => prev.filter((room) => room._id !== roomId));
    showToast(msg, "success");
  };

  useEffect(() => {
    getFavoriteRooms();
    // Re-sync the navbar badge with the server's real count whenever this
    // page is visited, in case it drifted (e.g. favorited from another tab).
    refreshFavoriteCount();
  }, []);

  return (
    <Box
      component={Paper}
      elevation={3}
      sx={{
        width: { xs: "100%", md: "90%" },
        mx: "auto",
        mt: 4,
        p: 3,
        borderRadius: 3,
      }}
    >
      <PageHeader title="My Favorite Rooms" />

      <Typography variant="h5" sx={{ my: 3, fontWeight: 600 }}>
        Favorite Rooms
      </Typography>

      {loading ? (
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
          <Typography>Loading favorites...</Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {favoriteRooms.map((room) => (
            <Grid key={room._id} size={{ xs: 12, sm: 6, md: 4, lg: 4 }}>
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
                  <RemoveFavoriteButton
                    roomId={room._id}
                    onSuccess={(msg) => handleRemoveSuccess(room._id, msg)}
                    onError={(msg) => showToast(msg, "error")}
                  />

                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewClick(room._id);
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
                  src={room.images?.[0] || cardImage}
                  alt={room.roomNumber}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "0.4s",
                  }}
                />

                {/* Overlay */}
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.75), transparent)",
                  }}
                />

                {/* Price */}
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
                  ${room.price}
                </Typography>

                {/* Discount */}
                {room.discount > 0 && (
                  <Chip
                    label={`${room.discount}% OFF`}
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

                {/* Room Info */}
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
                    Room {room.roomNumber}
                  </Typography>

                  <Typography variant="body2">
                    Capacity: {room.capacity}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {!loading && favoriteRooms.length === 0 && (
        <Typography color="text.secondary" sx={{ mt: 4, textAlign: "center" }}>
          No favorite rooms found.
        </Typography>
      )}

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