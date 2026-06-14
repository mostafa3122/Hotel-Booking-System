import React, { useEffect, useState } from "react";
import axios from "axios";
import axiosClient from "../../../services/api/axiosClient";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

// MUI
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Skeleton from "@mui/material/Skeleton";
import Divider from "@mui/material/Divider";

// Icons
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import BedIcon from "@mui/icons-material/KingBed";
import PersonIcon from "@mui/icons-material/Person";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Facility {
  _id: string;
  name: string;
}

interface Room {
  _id: string;
  roomNumber: string;
  price: number;
  discount: number;
  capacity: number;
  facilities: Facility[];
  images: string[];
  createdBy: { _id: string; userName: string };
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        p: 2.5,
        borderRadius: 2.5,
        border: "1px solid #f3f4f6",
        bgcolor: "#fff",
        flex: 1,
        minWidth: 140,
      }}
    >
      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: 2,
          bgcolor: `${color}18`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Box sx={{ color }}>{icon}</Box>
      </Box>
      <Box>
        <Typography variant="caption" color="text.disabled" sx={{ fontWeight: 500 }}>
          {label}
        </Typography>
        <Typography sx={{ fontWeight: 700, fontSize: 16, color: "text.primary", lineHeight: 1.3 }}>
          {value}
        </Typography>
      </Box>
    </Box>
  );
}

// ── Room Details Page ─────────────────────────────────────────────────────────
const RoomDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchRoom = async () => {
      setLoading(true);
      try {
        const res = await axiosClient.get(`admin/rooms/${id}`);
        // API may return { data: { room: {...} } } or { data: {...} }
        const payload = res.data?.data;
        setRoom(payload?.room ?? payload);
      } catch (err: unknown) {
        const msg = axios.isAxiosError(err)
          ? err.response?.data?.message || "Failed to load room."
          : "Something went wrong.";
        toast.error(msg);
        navigate("/dashboard/rooms");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchRoom();
  }, [id]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f9fafb",
        p: { xs: 2, sm: 3, md: 4 },
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3, flexWrap: "wrap", gap: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <IconButton
            onClick={() => navigate("/dashboard/rooms")}
            sx={{ bgcolor: "#fff", border: "1px solid #e5e7eb", borderRadius: 2, "&:hover": { bgcolor: "#f3f4f6" } }}
          >
            <ArrowBackIcon fontSize="small" />
          </IconButton>
          <Box>
            <Typography variant="h6"  color="text.primary" sx={{fontWeight:700}}>
              Room Details
            </Typography>
            <Typography variant="body2" color="text.secondary">
              View full information about this room
            </Typography>
          </Box>
        </Box>

        {!loading && room && (
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/dashboard/rooms/${room._id}/edit`)}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              bgcolor: "#2563eb",
              "&:hover": { bgcolor: "#1d4ed8" },
              px: 2.5,
            }}
          >
            Edit Room
          </Button>
        )}
      </Box>

      {loading ? (
        /* ── Skeleton ── */
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Skeleton variant="rounded" height={340} sx={{ borderRadius: 3 }} />
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            {[1, 2, 3, 4].map((i) => <Skeleton key={i} variant="rounded" height={80} sx={{ flex: 1, minWidth: 140, borderRadius: 2.5 }} />)}
          </Box>
          <Skeleton variant="rounded" height={120} sx={{ borderRadius: 3 }} />
        </Box>
      ) : room ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>

          {/* ── Image gallery ── */}
          <Paper elevation={0} sx={{ borderRadius: 3, border: "1px solid #f3f4f6", overflow: "hidden" }}>
            {/* Main image */}
            <Box
              sx={{
                width: "100%",
                height: { xs: 220, sm: 340 },
                bgcolor: "#f3f4f6",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {room.images?.[activeImage] ? (
                <Box
                  component="img"
                  src={room.images[activeImage]}
                  alt={`Room ${room.roomNumber}`}
                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                    e.currentTarget.src = "https://placehold.co/800x340?text=Room";
                  }}
                  sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <Box sx={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Typography color="text.disabled">No images available</Typography>
                </Box>
              )}

              {/* Room number badge */}
              <Box
                sx={{
                  position: "absolute",
                  top: 16,
                  left: 16,
                  bgcolor: "rgba(0,0,0,0.55)",
                  backdropFilter: "blur(4px)",
                  color: "#fff",
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 1.5,
                }}
              >
                <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
                  Room {room.roomNumber}
                </Typography>
              </Box>
            </Box>

            {/* Thumbnails */}
            {room.images?.length > 1 && (
              <Box sx={{ display: "flex", gap: 1, p: 2, overflowX: "auto" }}>
                {room.images.map((src, i) => (
                  <Box
                    key={i}
                    component="img"
                    src={src}
                    onClick={() => setActiveImage(i)}
                    sx={{
                      width: 72,
                      height: 56,
                      objectFit: "cover",
                      borderRadius: 1.5,
                      flexShrink: 0,
                      cursor: "pointer",
                      border: activeImage === i ? "2px solid #2563eb" : "2px solid transparent",
                      opacity: activeImage === i ? 1 : 0.65,
                      transition: "all 0.15s",
                      "&:hover": { opacity: 1 },
                    }}
                  />
                ))}
              </Box>
            )}
          </Paper>

          {/* ── Stat cards ── */}
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <StatCard
              icon={<AttachMoneyIcon />}
              label="Price per night"
              value={`$${room.price}`}
              color="#2563eb"
            />
            <StatCard
              icon={<PersonIcon />}
              label="Capacity"
              value={`${room.capacity} ${room.capacity === 1 ? "guest" : "guests"}`}
              color="#7c3aed"
            />
            <StatCard
              icon={<LocalOfferIcon />}
              label="Discount"
              value={room.discount > 0 ? `${room.discount}%` : "No discount"}
              color="#16a34a"
            />
            <StatCard
              icon={<BedIcon />}
              label="Room Number"
              value={String(room.roomNumber)}
              color="#ea580c"
            />
          </Box>

          {/* ── Facilities ── */}
          <Paper elevation={0} sx={{ borderRadius: 3, border: "1px solid #f3f4f6", p: 3 }}>
            <Typography sx={{ fontWeight: 700, fontSize: 15, mb: 2, color: "text.primary" }}>
              Facilities
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {room.facilities?.length > 0 ? (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {room.facilities.map((f) => (
                  <Chip
                    key={f._id}
                    label={f.name}
                    sx={{ bgcolor: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe", fontWeight: 500, fontSize: 13 }}
                  />
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.disabled">
                No facilities listed for this room.
              </Typography>
            )}
          </Paper>

          {/* ── Created by ── */}
          {room.createdBy && (
            <Paper elevation={0} sx={{ borderRadius: 3, border: "1px solid #f3f4f6", p: 3 }}>
              <Typography sx={{ fontWeight: 700, fontSize: 15, mb: 1, color: "text.primary" }}>
                Created By
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body2" color="text.secondary">
                {room.createdBy.userName}
              </Typography>
            </Paper>
          )}

        </Box>
      ) : null}
    </Box>
  );
};

export default RoomDetails;