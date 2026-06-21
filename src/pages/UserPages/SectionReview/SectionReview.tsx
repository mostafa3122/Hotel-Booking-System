import {
  Box,
  Container,
  Typography,
  IconButton,
  Rating,
  CircularProgress,
} from "@mui/material";

import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import { useCallback, useEffect, useState } from "react";
import axiosClient from "../../../services/api/axiosClient";
import SharedTitle from "../../../shared/userSharedComponent/SharedTitle/SharedTitle";

interface Room {
  _id: string;
  roomNumber: string;
  images: string[];
}

interface Review {
  _id?: string;
  roomId: string;
  rating: number;
  review: string;
  user?: {
    userName: string;
    profileImage: string;
  };
}

export default function SectionReview() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomIndex, setRoomIndex] = useState(0);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewIndex] = useState(0);

  const [loading, setLoading] = useState(true);

  const fetchReviews = useCallback(async (roomId: string) => {
    try {
      const res = await axiosClient.get(`/portal/room-reviews/${roomId}`);

      const data = res.data.data?.roomReviews || res.data.data || [];

      setReviews(data);
    } catch (err) {
      console.log(err);
      setReviews([]);
    }
  }, []);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);

        const res = await axiosClient.get("/portal/rooms/available", {
          params: {
            page: 1,
            size: 10,
            startDate: "2023-01-20",
            endDate: "2023-01-30",
          },
        });

        const data = res.data.data?.rooms || res.data.rooms || [];

        setRooms(data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  useEffect(() => {
    if (rooms.length > 0 && rooms[roomIndex]) {
      fetchReviews(rooms[roomIndex]._id);
    }
  }, [roomIndex, rooms, fetchReviews]);

  const nextRoom = () => {
    if (!rooms.length) return;
    setRoomIndex((prev) => (prev === rooms.length - 1 ? 0 : prev + 1));
  };

  const prevRoom = () => {
    if (!rooms.length) return;
    setRoomIndex((prev) => (prev === 0 ? rooms.length - 1 : prev - 1));
  };

  if (loading) {
    return (
      <Container sx={{ py: 10, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  const room = rooms[roomIndex];
  const review = reviews[reviewIndex];

  if (!room) {
    return (
      <Container sx={{ py: 10, textAlign: "center" }}>
        <Typography>No rooms available</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 10 }}>
      <SharedTitle title="Reviews" highlight="Rooms" />

      <Box
        sx={{
          display: "flex",
          gap: 6,
          alignItems: "center",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <Box sx={{ width: 440, height: 480 }}>
          <Box
            component="img"
            src={room.images?.[0] || "/placeholder.jpg"}
            alt={room.roomNumber}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "24px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
            }}
          />
        </Box>

        <Box sx={{ maxWidth: 520 }}>
          <Typography sx={{ fontSize: 26, fontWeight: 700 }}>
            Room {room.roomNumber}
          </Typography>

          <Typography sx={{ fontSize: 18, fontWeight: 600, mt: 1 }}>
            {review?.user?.userName || "Guest"}
          </Typography>

          <Rating
            value={review?.rating || 0}
            readOnly
            sx={{ mt: 1, color: "#FBBF24" }}
          />

          <Typography
            sx={{
              mt: 2,
              fontSize: 18,
              fontWeight: 500,
              lineHeight: 1.6,
            }}
          >
            {review?.review || "No review available for this room yet."}
          </Typography>

          <Typography sx={{ mt: 2, fontSize: 14, color: "#6B7280" }}>
            All reviews are collected from verified guests who stayed in this room.
          </Typography>

          <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
            <IconButton
              onClick={prevRoom}
              sx={{
                border: "1px solid #2563EB",
                color: "#2563EB",
                width: 42,
                height: 42,
              }}
            >
              <ArrowBackIosNewIcon fontSize="small" />
            </IconButton>

            <IconButton
              onClick={nextRoom}
              sx={{
                border: "1px solid #2563EB",
                color: "#2563EB",
                width: 42,
                height: 42,
              }}
            >
              <ArrowForwardIosIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}