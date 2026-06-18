import { useEffect, useState } from "react";
import { Box, Card, Chip, Grid, Paper, Typography } from "@mui/material";

import axiosClient from "../../../services/api/axiosClient";
import cardImage from "../../../assets/card.png";
import PageHeader from "../../../shared/userSharedComponent/PageHeader/PageHeader";
import axios from "axios";

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

  const getFavoriteRooms = async () => {
    try {
      setLoading(true);

      const response = await axiosClient.get("/portal/favorite-rooms");
      console.log(response.data.data.favoriteRooms);

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

  useEffect(() => {
    getFavoriteRooms();
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
        <Typography>Loading...</Typography>
      ) : (
        <Grid container spacing={3}>
          {favoriteRooms.map((room) => (
            <Grid key={room._id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                sx={{
                  height: "250px",
                  position: "relative",
                  borderRadius: "15px",
                  overflow: "hidden",
                  boxShadow: 4,
                  transition: "0.3s",
                  "&:hover": {
                    transform: "scale(1.02)",
                    boxShadow: 6,
                  },
                }}
              >
                {/* Image */}
                <img
                  src={room.images?.[0] || cardImage}
                  alt={room.roomNumber}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />

                {/* Overlay */}
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0.1))",
                  }}
                />

                {/* Price */}
                <Typography
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    backgroundColor: "#FF498B",
                    color: "#fff",
                    borderRadius: "0px 15px",
                    px: 2,
                    py: 0.5,
                    fontSize: "13px",
                    fontWeight: "bold",
                    zIndex: 2,
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
                      zIndex: 2,
                    }}
                  />
                )}

                {/* Room Info */}
                <Typography
                  sx={{
                    position: "absolute",
                    bottom: 10,
                    left: 10,
                    color: "#fff",
                    fontWeight: "bold",
                    zIndex: 2,
                    fontSize: "15px",
                    backgroundColor: "rgba(0,0,0,0.4)",
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 2,
                  }}
                >
                  Room : {room.roomNumber}
                  <br />
                  Capacity : {room.capacity}
                </Typography>
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
    </Box>
  );
}
