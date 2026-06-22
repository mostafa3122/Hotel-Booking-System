import {
  Box,
  Card,
  Chip,
  Grid,
  Paper,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axiosClient from "../../../services/api/axiosClient";
import PageHeader from "../../../shared/userSharedComponent/PageHeader/PageHeader";
import cardImage from "../../../assets/card.png";
import axios from "axios";

interface Room {
  _id: string;
  roomNumber: string;
  price: number;
  capacity: number;
  discount: number;
  images: string[];
}

export default function Explore() {
  const [searchParams] = useSearchParams();

  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const capacity = searchParams.get("capacity");

  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔥 Toast state
  const [toast, setToast] = useState({
    open: false,
    message: "",
    type: "success" as "success" | "error" | "info" | "warning",
  });

  const showToast = (
    message: string,
    type: "success" | "error" | "info" | "warning" = "success"
  ) => {
    setToast({
      open: true,
      message,
      type,
    });
  };

  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, open: false }));
  };
useEffect(() => {
  const fetchRooms = async () => {
    try {
      setLoading(true);

      const response = await axiosClient.get("/portal/rooms/available", {
        params: {
          startDate: checkIn,
          endDate: checkOut,
          capacity: capacity ? Number(capacity) : undefined,
          page: 1,
          size: 10,
        },
      });

      setRooms(response?.data?.data?.rooms || []);

      const msg = response?.data?.message;
      if (msg) showToast(msg, "success");

    } catch (error) {
      let errMsg = "Something went wrong";

      if (axios.isAxiosError(error)) {
        errMsg =
          error.response?.data?.message ||
          error.message ||
          "Request failed";
      }

      showToast(errMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  fetchRooms();
}, [checkIn, checkOut, capacity]);
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
      <PageHeader title="Explore Available Rooms" />

      <Typography sx={{ my: 3 }}>
        Available Rooms
      </Typography>

      {/* Loading */}
      {loading && (
        <Typography sx={{ mb: 2 }}>
          Loading rooms...
        </Typography>
      )}

      {/* Empty state */}
      {!loading && rooms.length === 0 && (
        <Typography sx={{ mb: 2 }}>
          No rooms found for selected filters
        </Typography>
      )}

      {/* GRID */}
      <Grid container spacing={{ xs: 2, md: 3 }}>
        {rooms.map((room) => (
          <Grid
            key={room._id}
            size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
          >
            <Card
              sx={{
                height: 260,
                position: "relative",
                borderRadius: "18px",
                overflow: "hidden",
                boxShadow: 3,
                transition: "all 0.35s ease",
                cursor: "pointer",
                "&:hover": {
                  transform: "translateY(-6px) scale(1.02)",
                  boxShadow: 10,
                },
                "&:hover img": {
                  transform: "scale(1.1)",
                },
              }}
            >
              {/* Image */}
              <img
                src={room.images?.[0] || cardImage}
                alt="room"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 0.5s ease",
                }}
              />

              {/* Overlay */}
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.75), rgba(0,0,0,0.1))",
                }}
              />

              {/* Price */}
              <Typography
                sx={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  background: "rgba(255, 73, 139, 0.9)",
                  color: "#fff",
                  px: 2,
                  py: 0.5,
                  fontSize: 12,
                  fontWeight: "bold",
                  borderRadius: "10px",
                }}
              >
                ${room.price} / night
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

              {/* Info */}
              <Typography
                sx={{
                  position: "absolute",
                  bottom: 10,
                  left: 10,
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: 13,
                  px: 1.5,
                  py: 0.7,
                  borderRadius: 2,
                  background: "rgba(255,255,255,0.12)",
                  backdropFilter: "blur(6px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                Room: {room.roomNumber} <br />
                Capacity: {room.capacity}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* 🔥 Toast (TOP CENTER + STYLED) */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseToast}
          severity={toast.type}
          variant="filled"
          sx={{
            width: "100%",
            borderRadius: "12px",
            fontWeight: 600,
            boxShadow: 6,
            px: 2,
            py: 1,
            fontSize: "14px",
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}