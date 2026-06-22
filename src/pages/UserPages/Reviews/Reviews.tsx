import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../../../services/api/axiosClient";

// MUI
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Rating from "@mui/material/Rating";
import Skeleton from "@mui/material/Skeleton";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Grid from "@mui/material/Grid";

// Icons
import SearchIcon from "@mui/icons-material/Search";
import MeetingRoomOutlinedIcon from "@mui/icons-material/MeetingRoomOutlined";

// ── Types ─────────────────────────────────────────────────────────────────────
interface RoomListItem {
  _id: string;
  roomNumber: string;
  price: number;
  images: string[];
}

interface ReviewUser {
  _id: string;
  userName: string;
  profileImage?: string;
}

interface ReviewRoom {
  _id: string;
  roomNumber: string;
}

interface RoomReview {
  _id: string;
  room: ReviewRoom;
  user: ReviewUser;
  rating: number;
  review: string;
  createdAt: string;
  updatedAt: string;
}

const PAGE_SIZE = 10;

// ── Helpers ───────────────────────────────────────────────────────────────────
function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const sec = Math.floor(diffMs / 1000);
  const min = Math.floor(sec / 60);
  const hr = Math.floor(min / 60);
  const day = Math.floor(hr / 24);
  const month = Math.floor(day / 30);
  const year = Math.floor(day / 365);

  if (year >= 1) return `${year} ${year === 1 ? "year" : "years"} ago`;
  if (month >= 1) return `${month} ${month === 1 ? "month" : "months"} ago`;
  if (day >= 1) return `${day} ${day === 1 ? "day" : "days"} ago`;
  if (hr >= 1) return `${hr} ${hr === 1 ? "hour" : "hours"} ago`;
  if (min >= 1) return `${min} ${min === 1 ? "minute" : "minutes"} ago`;
  return "just now";
}

// ── Room list row (left panel) ─────────────────────────────────────────────────
function RoomRow({
  room,
  active,
  onClick,
}: {
  room: RoomListItem;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Box
      onClick={onClick}
      sx={{
        display: "flex", alignItems: "center", gap: 1.4,
        p: 1.2, borderRadius: 2, cursor: "pointer",
        bgcolor: active ? "#EFEDFB" : "transparent",
        border: active ? "1px solid #D9D3F7" : "1px solid transparent",
        transition: "background-color 0.15s, border-color 0.15s",
        "&:hover": { bgcolor: active ? "#EFEDFB" : "#F8F7FD" },
      }}
    >
      <Box
        sx={{
          width: 46, height: 38, borderRadius: 1.5, overflow: "hidden",
          bgcolor: "#F3F1FB", flexShrink: 0,
        }}
      >
        {room.images?.[0] ? (
          <Box
            component="img"
            src={room.images[0]}
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
              e.currentTarget.src = "https://placehold.co/46x38?text=";
            }}
            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <Box sx={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <MeetingRoomOutlinedIcon sx={{ fontSize: 16, color: "#9A97AE" }} />
          </Box>
        )}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontSize: 13, fontWeight: active ? 700 : 600, color: "#1F1B3C" }}>
          Room {room.roomNumber}
        </Typography>
        <Typography sx={{ fontSize: 11, color: "#9A97AE" }}>
          ${room.price} / night
        </Typography>
      </Box>
    </Box>
  );
}

// ── Single review card (right panel) ──────────────────────────────────────────
function ReviewCard({ review }: { review: RoomReview }) {
  const { user, rating, review: text, createdAt } = review;
  const initial = user.userName?.charAt(0).toUpperCase() ?? "?";

  return (
    <Box
      sx={{
        display: "flex", gap: 1.5, p: 2, borderRadius: 2.5,
        border: "1px solid #EFEDF8", bgcolor: "#fff",
        transition: "border-color 0.2s, box-shadow 0.2s",
        "&:hover": { borderColor: "#D9D3F7", boxShadow: "0 6px 18px -10px rgba(70,40,200,0.2)" },
      }}
    >
      <Avatar
        src={user.profileImage}
        alt={user.userName}
        sx={{ width: 42, height: 42, bgcolor: "#3D2EBF", fontSize: 16, fontWeight: 700, flexShrink: 0 }}
      >
        {initial}
      </Avatar>
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1, mb: 0.3 }}>
          <Typography sx={{ fontSize: 13.5, fontWeight: 700, color: "#1F1B3C" }}>
            {user.userName}
          </Typography>
          <Typography sx={{ fontSize: 11, color: "#9A97AE", flexShrink: 0 }}>
            {timeAgo(createdAt)}
          </Typography>
        </Box>
        <Rating value={rating} readOnly size="small" sx={{ fontSize: 16, mb: 0.6 }} />
        <Typography sx={{ fontSize: 12.5, color: "#6B6880", lineHeight: 1.6 }}>
          {text}
        </Typography>
      </Box>
    </Box>
  );
}

function ReviewCardSkeleton() {
  return (
    <Box sx={{ display: "flex", gap: 1.5, p: 2, borderRadius: 2.5, border: "1px solid #EFEDF8" }}>
      <Skeleton variant="circular" width={42} height={42} />
      <Box sx={{ flex: 1 }}>
        <Skeleton variant="text" width="40%" height={20} />
        <Skeleton variant="text" width={90} height={16} sx={{ mb: 0.5 }} />
        <Skeleton variant="text" width="90%" height={16} />
        <Skeleton variant="text" width="60%" height={16} />
      </Box>
    </Box>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
const Reviews = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // ── Room list — fetch ALL rooms once (the backend ignores search/filter
  // params on this endpoint, so we have no choice but to load everything
  // and filter + paginate entirely on the client). ──────────────────────────
  const [allRooms, setAllRooms] = useState<RoomListItem[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(true);

  useEffect(() => {
    const fetchAllRooms = async () => {
      setLoadingRooms(true);
      try {
        // Pull every room by paging through the API until a short/empty
        // page tells us we've reached the end. size:100 keeps the number
        // of requests small even for a few hundred rooms.
        let pageNum = 1;
        let collected: RoomListItem[] = [];
        // Safety cap so a misbehaving API can't loop forever
        const MAX_PAGES = 20;

        while (pageNum <= MAX_PAGES) {
          const res = await axiosClient.get("portal/rooms/available", {
            params: { page: pageNum, size: 100 },
          });
          const list: RoomListItem[] = res.data?.data?.rooms ?? [];
          collected = [...collected, ...list];
          if (list.length < 100) break; // last page reached
          pageNum += 1;
        }

        setAllRooms(collected);

        if (!id && collected.length > 0) {
          navigate(`/reviews/${collected[0]._id}`, { replace: true });
        }
      } catch {
        setAllRooms([]);
      } finally {
        setLoadingRooms(false);
      }
    };
    fetchAllRooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Search + client-side pagination ─────────────────────────────────────
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Rooms whose name STARTS WITH the search term (case-insensitive),
  // matching "type R, see all rooms starting with R" behavior.
  const filteredRooms = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return allRooms;
    return allRooms.filter((r) =>
      (r.roomNumber ?? "").toString().toLowerCase().startsWith(term)
    );
  }, [allRooms, search]);

  const visibleRooms = filteredRooms.slice(0, visibleCount);
  const hasMore = filteredRooms.length > visibleCount;

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setVisibleCount(PAGE_SIZE); // restart pagination on every new search
  };

  // ── Reviews for the selected room (right panel) ─────────────────────────────
  const [reviews, setReviews] = useState<RoomReview[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setLoadingReviews(false);
      return;
    }
    const fetchReviews = async () => {
      setLoadingReviews(true);
      setError("");
      try {
        const res = await axiosClient.get(`portal/room-reviews/${id}`);
        const payload = res.data?.data;
        setReviews(payload?.roomReviews ?? []);
        setTotalCount(payload?.totalCount ?? payload?.roomReviews?.length ?? 0);
      } catch (err: unknown) {
        const msg = axios.isAxiosError(err)
          ? err.response?.data?.message || "Failed to load reviews."
          : "Something went wrong.";
        setError(msg);
      } finally {
        setLoadingReviews(false);
      }
    };
    fetchReviews();
  }, [id]);

  const averageRating =
    reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;

  const selectedRoom = allRooms.find((r) => r._id === id);

  return (
    <Box sx={{ maxWidth: 1100, mx: "auto", p: { xs: 2, sm: 3, md: 4 } }}>
      <Typography sx={{ fontSize: 22, fontWeight: 800, color: "#1F1B3C", mb: 0.5 }}>
        Reviews
      </Typography>
      <Typography sx={{ fontSize: 13, color: "#9A97AE", mb: 3 }}>
        Pick a room to see what guests are saying
      </Typography>

      <Grid container spacing={3}>
        {/* ── Left: room picker ── */}
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search by room Number…"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            sx={{
              mb: 1.5,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2, fontSize: 13,
                "& fieldset": { borderColor: "#EFEDF8" },
              },
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: 17, color: "#9A97AE" }} />
                  </InputAdornment>
                ),
              },
            }}
          />

          <Box
            sx={{
              display: "flex", flexDirection: "column", gap: 0.5,
              maxHeight: 480, overflowY: "auto", pr: 0.5,
            }}
          >
            {loadingRooms ? (
              Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} variant="rounded" height={56} sx={{ borderRadius: 2 }} />
              ))
            ) : filteredRooms.length === 0 ? (
              <Typography sx={{ fontSize: 12.5, color: "#9A97AE", textAlign: "center", py: 3 }}>
                {search ? `No rooms start with "${search}".` : "No rooms found."}
              </Typography>
            ) : (
              <>
                {visibleRooms.map((room) => (
                  <RoomRow
                    key={room._id}
                    room={room}
                    active={room._id === id}
                    onClick={() => navigate(`/reviews/${room._id}`)}
                  />
                ))}

                {hasMore && (
                  <Box
                    onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                    sx={{
                      mt: 0.5, textAlign: "center", py: 1, borderRadius: 2,
                      fontSize: 12.5, fontWeight: 600, color: "#3D2EBF",
                      cursor: "pointer", border: "1px dashed #D9D3F7",
                      "&:hover": { bgcolor: "#F3F1FB", borderColor: "#B8B0F0" },
                    }}
                  >
                    Show More ({filteredRooms.length - visibleCount} more)
                  </Box>
                )}
              </>
            )}
          </Box>
        </Grid>

        {/* ── Right: selected room's reviews ── */}
        <Grid size={{ xs: 12, sm: 8 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
            <Typography sx={{ fontSize: 15, fontWeight: 700, color: "#1F1B3C" }}>
              {selectedRoom ? `Room ${selectedRoom.roomNumber}` : "Reviews"}{" "}
              {totalCount > 0 && (
                <Box component="span" sx={{ color: "#9A97AE", fontWeight: 500 }}>
                  ({totalCount})
                </Box>
              )}
            </Typography>

            {!loadingReviews && reviews.length > 0 && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
                <Rating value={averageRating} precision={0.1} readOnly size="small" sx={{ fontSize: 16 }} />
                <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#1F1B3C" }}>
                  {averageRating.toFixed(1)}
                </Typography>
              </Box>
            )}
          </Box>

          <Divider sx={{ mb: 2 }} />

          {!id ? (
            <Box sx={{ textAlign: "center", py: 6 }}>
              <Typography sx={{ fontSize: 13, color: "#9A97AE" }}>
                Select a room from the list to see its reviews.
              </Typography>
            </Box>
          ) : loadingReviews ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <ReviewCardSkeleton />
              <ReviewCardSkeleton />
              <ReviewCardSkeleton />
            </Box>
          ) : error ? (
            <Typography sx={{ fontSize: 13, color: "error.main", textAlign: "center", py: 4 }}>
              {error}
            </Typography>
          ) : reviews.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 5 }}>
              <Typography sx={{ fontSize: 13, color: "#9A97AE" }}>
                No reviews yet for this room.
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {reviews.map((r) => (
                <ReviewCard key={r._id} review={r} />
              ))}
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Reviews;