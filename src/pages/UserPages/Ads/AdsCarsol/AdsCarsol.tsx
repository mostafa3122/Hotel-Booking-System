import {
  Box,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
  IconButton,
  Chip,
} from "@mui/material";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import VisibilityIcon from "@mui/icons-material/Visibility";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import axiosClient from "../../../../services/api/axiosClient";
import SharedTitle from "../../../../shared/userSharedComponent/SharedTitle/SharedTitle";
import FavoriteButton from "../FavoriteButton/FavoriteButton";


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

export default function AllAdsSwiper() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const [toast, setToast] = useState({
    open: false,
    message: "",
    type: "success" as "success" | "error",
  });

  const isAuthenticated = Boolean(localStorage.getItem("token"));

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ open: true, message: msg, type });
  };

  const handleCloseToast = () => {
    setToast((p) => ({ ...p, open: false }));
  };

  const handleView = (roomId: string) => {
    navigate(`/room-details/${roomId}`);
  };

  useEffect(() => {
    const fetchAds = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get("/portal/ads");
        setAds(res?.data?.data?.ads || []); 
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
      <Box sx={{textAlign:"center" ,mt:5}} >
        <CircularProgress />
        <Typography sx={{mt:2}} >Loading ads...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: "1400px", mx: "auto", py: 8 }}>
      <SharedTitle title="" highlight="ADS" />

      {/* SWIPER */}
      <Box sx={{mt:4}} >
        <Swiper
          spaceBetween={20}
          slidesPerView={4}
          autoplay={{ delay: 2000, disableOnInteraction: false }}
          modules={[Autoplay]}
          breakpoints={{
            0: { slidesPerView: 1 },
            600: { slidesPerView: 2 },
            960: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
        >
          {ads.map((ad) => (
            <SwiperSlide key={ad._id}>
              <Box
                sx={{
                  position: "relative",
                  borderRadius: 3,
                  overflow: "hidden",
                  height: 260,
                  cursor: "pointer",
                  "&:hover img": { transform: "scale(1.1)" },
                  "&:hover .actions": { opacity: 1 },
                }}
              >
                {/* IMAGE */}
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

                {/* DARK OVERLAY */}
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.75), transparent)",
                  }}
                />

                {/* PRICE */}
                <Chip
                  label={`$${ad.room.price}`}
                  sx={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    bgcolor: "#ff4081",
                    color: "#fff",
                    fontWeight: "bold",
                  }}
                />

                {/* DISCOUNT */}
                {ad.room.discount > 0 && (
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

                {/* ACTIONS */}
                <Box
                  className="actions"
                  sx={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2,
                    opacity: 0,
                    transition: "0.3s",
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
                      handleView(ad.room._id);
                    }}
                    sx={{ color: "#fff", bgcolor: "rgba(255,255,255,0.2)" }}
                  >
                    <VisibilityIcon />
                  </IconButton>
                </Box>

                {/* TEXT */}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 12,
                    left: 12,
                    color: "#fff",
                  }}
                >
                  <Typography  sx={{fontWeight:600}}>
                    Room {ad.room.roomNumber}
                  </Typography>
                  <Typography sx={{fontSize:12}} >
                    {ad.createdBy?.userName}
                  </Typography>
                </Box>
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>

      {/* TOAST */}
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