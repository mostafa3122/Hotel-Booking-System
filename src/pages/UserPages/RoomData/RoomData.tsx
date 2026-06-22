import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axiosClient from "../../../services/api/axiosClient";
import { AuthContext } from "../../../context/AuthContext";

// MUI
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Grid from "@mui/material/Grid";
import Popover from "@mui/material/Popover";
import IconButton from "@mui/material/IconButton";
import Rating from "@mui/material/Rating";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Collapse from "@mui/material/Collapse";

// Icons
import BedOutlinedIcon from "@mui/icons-material/BedOutlined";
import WeekendOutlinedIcon from "@mui/icons-material/WeekendOutlined";
import BathtubOutlinedIcon from "@mui/icons-material/BathtubOutlined";
import RestaurantOutlinedIcon from "@mui/icons-material/RestaurantOutlined";
import WifiOutlinedIcon from "@mui/icons-material/WifiOutlined";
import KitchenOutlinedIcon from "@mui/icons-material/KitchenOutlined";
import TvOutlinedIcon from "@mui/icons-material/TvOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import CloseIcon from "@mui/icons-material/Close";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Facility {
  _id: string;
  name: string;
}

interface Room {
  _id: string;
  roomNumber: string;
  price: number;
  capacity: number;
  discount: number;
  facilities: Facility[];
  createdBy: { _id: string; userName: string };
  images: string[];
}

interface Review {
  _id: string;
  rating: number;
  review: string;
  user?: { _id: string; userName: string };
  createdBy?: { _id: string; userName: string };
  createdAt?: string;
}

interface Comment {
  _id: string;
  comment: string;
  user?: { _id: string; userName: string; profileImage?: string };
  createdAt?: string;
}

// ── Facility Pill ─────────────────────────────────────────────────────────────
function FacilityPill({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string }) {
  return (
    <Box
      sx={{
        display: "flex", alignItems: "center", gap: 1.2,
        border: "1px solid #EFEDF8", borderRadius: 2,
        px: 1.4, py: 1.1,
        transition: "border-color 0.2s, box-shadow 0.2s",
        "&:hover": { borderColor: "#D9D3F7", boxShadow: "0 4px 14px -8px rgba(70,40,200,0.25)" },
      }}
    >
      <Box sx={{ width: 34, height: 34, borderRadius: "10px", flexShrink: 0, bgcolor: "#F3F1FB", color: "#3D2EBF", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {icon}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        {value && (
          <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#1F1B3C", lineHeight: 1.2 }}>{value}</Typography>
        )}
        <Typography sx={{ fontSize: 11.5, color: "#9A97AE", lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {label}
        </Typography>
      </Box>
    </Box>
  );
}

function facilityIcon(name: string) {
  const n = name.toLowerCase();
  if (n.includes("wifi")) return <WifiOutlinedIcon sx={{ fontSize: 16 }} />;
  if (n.includes("tv") || n.includes("television")) return <TvOutlinedIcon sx={{ fontSize: 16 }} />;
  if (n.includes("kitchen") || n.includes("fridge") || n.includes("refrigerator")) return <KitchenOutlinedIcon sx={{ fontSize: 16 }} />;
  if (n.includes("bath")) return <BathtubOutlinedIcon sx={{ fontSize: 16 }} />;
  if (n.includes("dining")) return <RestaurantOutlinedIcon sx={{ fontSize: 16 }} />;
  if (n.includes("living")) return <WeekendOutlinedIcon sx={{ fontSize: 16 }} />;
  return <BedOutlinedIcon sx={{ fontSize: 16 }} />;
}

// ── Date Range Calendar ───────────────────────────────────────────────────────
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAY_NAMES = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function formatShort(d: Date) {
  return `${d.getDate()} ${MONTH_NAMES[d.getMonth()].slice(0, 3)}`;
}

function DateRangeCalendar({ checkIn, checkOut, onSelect }: { checkIn: Date | null; checkOut: Date | null; onSelect: (start: Date | null, end: Date | null) => void }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [viewMonth, setViewMonth] = useState(new Date(checkIn ?? today));

  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const startOffset = firstOfMonth.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (Date | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
  ];

  const handleDayClick = (day: Date) => {
    if (day < today) return;
    if (!checkIn || (checkIn && checkOut)) { onSelect(day, null); }
    else if (day < checkIn) { onSelect(day, null); }
    else { onSelect(checkIn, day); }
  };

  const isInRange = (day: Date) => checkIn && checkOut && day > checkIn && day < checkOut;

  return (
    <Box sx={{ p: 2, width: 280 }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
        <IconButton size="small" onClick={() => setViewMonth(new Date(year, month - 1, 1))}><ChevronLeftIcon fontSize="small" /></IconButton>
        <Typography sx={{ fontSize: 13.5, fontWeight: 700, color: "#1F1B3C" }}>{MONTH_NAMES[month]} {year}</Typography>
        <IconButton size="small" onClick={() => setViewMonth(new Date(year, month + 1, 1))}><ChevronRightIcon fontSize="small" /></IconButton>
      </Box>
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", mb: 0.5 }}>
        {DAY_NAMES.map((d) => (
          <Typography key={d} sx={{ fontSize: 10.5, color: "#9A97AE", textAlign: "center", fontWeight: 600 }}>{d}</Typography>
        ))}
      </Box>
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 0.3 }}>
        {cells.map((day, i) => {
          if (!day) return <Box key={i} />;
          const disabled = day < today;
          const selectedStart = checkIn && isSameDay(day, checkIn);
          const selectedEnd = checkOut && isSameDay(day, checkOut);
          const inRange = isInRange(day);
          return (
            <Box key={i} onClick={() => !disabled && handleDayClick(day)} sx={{ aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, borderRadius: 1.2, cursor: disabled ? "default" : "pointer", color: disabled ? "#D9D7E3" : selectedStart || selectedEnd ? "#fff" : "#1F1B3C", bgcolor: selectedStart || selectedEnd ? "#3D2EBF" : inRange ? "#EFEDFB" : "transparent", fontWeight: selectedStart || selectedEnd ? 700 : 500, "&:hover": !disabled ? { bgcolor: selectedStart || selectedEnd ? "#3D2EBF" : "#F3F1FB" } : {} }}>
              {day.getDate()}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

// ── Review Item — no edit/delete, read-only ───────────────────────────────────
function ReviewItem({ name, content, rate }: { name: string; content: string; rate?: number }) {
  const initial = name.charAt(0).toUpperCase();
  return (
    <Box sx={{ display: "flex", gap: 1.2, py: 1.5 }}>
      <Avatar sx={{ width: 30, height: 30, fontSize: 13, bgcolor: "#3D2EBF" }}>{initial}</Avatar>
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.3 }}>
          <Typography sx={{ fontSize: 12.5, fontWeight: 700, color: "#1F1B3C" }}>{name}</Typography>
          {typeof rate === "number" && (
            <Rating value={rate} readOnly size="small" sx={{ fontSize: 14 }} />
          )}
        </Box>
        <Typography sx={{ fontSize: 12, color: "#6B6880", lineHeight: 1.5 }}>{content}</Typography>
      </Box>
    </Box>
  );
}

// ── Comment Item — with edit/delete for owner ─────────────────────────────────
function CommentItem({
  name,
  content,
  isOwner,
  onDelete,
  onEdit,
}: {
  name: string;
  content: string;
  isOwner?: boolean;
  onDelete?: () => void;
  onEdit?: (newText: string) => void;
}) {
  const initial = name.charAt(0).toUpperCase();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(content);
  const [deleting, setDeleting] = useState(false);

  return (
    <Box
      sx={{
        display: "flex", gap: 1.2, py: 1.5, px: 1.5,
        borderRadius: 2,
        border: "1px solid #EFEDF8",
        mb: 1,
        bgcolor: "#FDFCFF",
        transition: "border-color 0.2s",
        "&:hover": { borderColor: "#D9D3F7" },
      }}
    >
      <Avatar sx={{ width: 32, height: 32, fontSize: 13, bgcolor: "#3D2EBF", flexShrink: 0 }}>{initial}</Avatar>
      <Box sx={{ minWidth: 0, flex: 1 }}>
        {/* Header row */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.4 }}>
          <Typography sx={{ fontSize: 12.5, fontWeight: 700, color: "#1F1B3C" }}>{name}</Typography>

          {isOwner && !editing && (
            <Box sx={{ display: "flex", gap: 0.5 }}>
              <IconButton
                size="small"
                onClick={() => { setDraft(content); setEditing(true); }}
                sx={{
                  width: 26, height: 26, borderRadius: 1.5,
                  color: "#3D2EBF",
                  bgcolor: "#EFEDFB",
                  "&:hover": { bgcolor: "#E0DCFA" },
                }}
              >
                <EditOutlinedIcon sx={{ fontSize: 14 }} />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => setDeleting(true)}
                sx={{
                  width: 26, height: 26, borderRadius: 1.5,
                  color: "#E0473E",
                  bgcolor: "#FDECEA",
                  "&:hover": { bgcolor: "#FAD4D2" },
                }}
              >
                <DeleteOutlineIcon sx={{ fontSize: 14 }} />
              </IconButton>
            </Box>
          )}
        </Box>

        {/* Delete confirmation */}
        {deleting && (
          <Box
            sx={{
              display: "flex", alignItems: "center", gap: 1,
              bgcolor: "#FFF4F4", border: "1px solid #FAD4D2",
              borderRadius: 1.5, px: 1.2, py: 0.8, mb: 0.8,
            }}
          >
            <Typography sx={{ fontSize: 11.5, color: "#E0473E", flex: 1 }}>
              Delete this comment?
            </Typography>
            <Button
              size="small"
              onClick={() => { onDelete?.(); setDeleting(false); }}
              sx={{
                fontSize: 11, textTransform: "none", fontWeight: 700,
                minWidth: 0, px: 1.2, py: 0.3,
                bgcolor: "#E0473E", color: "#fff",
                borderRadius: 1,
                "&:hover": { bgcolor: "#C73C34" },
              }}
            >
              Yes
            </Button>
            <Button
              size="small"
              onClick={() => setDeleting(false)}
              sx={{
                fontSize: 11, textTransform: "none", fontWeight: 600,
                minWidth: 0, px: 1.2, py: 0.3,
                color: "#6B6880", borderRadius: 1,
                border: "1px solid #D9D3F7",
              }}
            >
              No
            </Button>
          </Box>
        )}

        {/* Edit mode */}
        {editing ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.8, mt: 0.3 }}>
            <TextField
              size="small"
              fullWidth
              multiline
              minRows={2}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  fontSize: 12,
                  borderRadius: 1.5,
                  "& fieldset": { borderColor: "#D9D3F7" },
                  "&:hover fieldset": { borderColor: "#B8B0F0" },
                  "&.Mui-focused fieldset": { borderColor: "#3D2EBF" },
                },
              }}
            />
            <Box sx={{ display: "flex", gap: 0.8 }}>
              <Button
                size="small"
                variant="contained"
                onClick={() => { onEdit?.(draft); setEditing(false); }}
                sx={{
                  fontSize: 11, textTransform: "none", fontWeight: 700,
                  bgcolor: "#3D2EBF", borderRadius: 1.5, px: 2, py: 0.5,
                  "&:hover": { bgcolor: "#2F23A0" },
                }}
              >
                Save
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={() => { setDraft(content); setEditing(false); }}
                sx={{
                  fontSize: 11, textTransform: "none", fontWeight: 600,
                  borderColor: "#D9D3F7", color: "#6B6880", borderRadius: 1.5, px: 2, py: 0.5,
                  "&:hover": { borderColor: "#B8B0F0", bgcolor: "#F3F1FB" },
                }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        ) : (
          !deleting && (
            <Typography sx={{ fontSize: 12, color: "#6B6880", lineHeight: 1.5 }}>{content}</Typography>
          )
        )}
      </Box>
    </Box>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function RoomData() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { userData } = useContext(AuthContext);
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  const [bookHover, setBookHover] = useState(false);

  // ── Lightbox ───────────────────────────────────────────────────────────────
  // Derived fresh each render so it's always in sync with room.images, even
  // while room is still null (loading) — keeps this safe to reference from
  // hooks that must run unconditionally, before the loading/error returns.
  const galleryImages = room?.images?.length ? room.images : [];

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };
  const closeLightbox = () => setLightboxOpen(false);
  const lightboxPrev = () =>
    setLightboxIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  const lightboxNext = () =>
    setLightboxIndex((prev) => (prev + 1) % galleryImages.length);

  // Keyboard navigation while the lightbox is open
  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") lightboxPrev();
      if (e.key === "ArrowRight") lightboxNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxOpen, galleryImages.length]);

  // Lock body scroll while the lightbox is open
  useEffect(() => {
    document.body.style.overflow = lightboxOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightboxOpen]);

  // ── Date picker ────────────────────────────────────────────────────────────
  const [dateAnchor, setDateAnchor] = useState<null | HTMLElement>(null);
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);

  const openDatePicker = (e: React.MouseEvent<HTMLElement>) => setDateAnchor(e.currentTarget);
  const closeDatePicker = () => setDateAnchor(null);
  const handleDateSelect = (start: Date | null, end: Date | null) => {
    setCheckIn(start); setCheckOut(end);
    if (start && end) closeDatePicker();
  };

  const isLoggedIn = !!userData;

  // ── Feedback state ─────────────────────────────────────────────────────────
  const [reviews, setReviews] = useState<Review[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);

  const [rateValue, setRateValue] = useState<number | null>(0);
  const [rateMessage, setRateMessage] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  // ── Fetch feedback ─────────────────────────────────────────────────────────
  // Pulled out of useEffect so it can be re-called after posting a comment/review.
  // This is what guarantees we always have a real Mongo _id and a populated
  // user object, instead of guessing the shape of the POST response.
  const fetchFeedback = async () => {
    if (!id) return;
    setLoadingFeedback(true);
    try {
      const [reviewsRes, commentsRes] = await Promise.all([
        axiosClient.get(`portal/room-reviews/${id}`),
        axiosClient.get(`portal/room-comments/${id}`),
      ]);

      const rData = reviewsRes.data?.data;
      const reviewList: Review[] = Array.isArray(rData)
        ? rData
        : Array.isArray(rData?.reviews)
          ? rData.reviews
          : Array.isArray(rData?.roomReviews)
            ? rData.roomReviews
            : [];

      const cData = commentsRes.data?.data;
      const commentList: Comment[] = Array.isArray(cData?.roomComments)
        ? cData.roomComments
        : Array.isArray(cData)
          ? cData
          : [];

      setReviews(reviewList);
      setComments(commentList);
    } catch (err) {
      console.error("Feedback fetch error:", err);
    } finally {
      setLoadingFeedback(false);
    }
  };

  useEffect(() => {
    if (!isLoggedIn || !id) return;
    fetchFeedback();
  }, [isLoggedIn, id]);

  // ── Ownership helper ───────────────────────────────────────────────────────
  const isMine = (owner?: { _id?: string }) => {
    if (!userData || !owner) return false;
    return String(userData._id) === String(owner._id);
  };

  // ── Review handlers ────────────────────────────────────────────────────────
  const handleSubmitReview = async () => {
    if (!rateValue) { toast.warning("Please select a star rating."); return; }
    setSubmittingReview(true);
    try {
      await axiosClient.post(`portal/room-reviews`, { roomId: id, rating: rateValue, review: rateMessage });
      setRateValue(0); setRateMessage("");
      toast.success("Thanks for your rating!");
      await fetchFeedback(); // re-fetch so the new review has a real _id and populated user
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err) ? err.response?.data?.message || "Failed to submit rating." : "Something went wrong.";
      toast.error(msg);
    } finally { setSubmittingReview(false); }
  };

  // ── Comment handlers ───────────────────────────────────────────────────────
  const handleSubmitComment = async () => {
    if (!commentText.trim()) { toast.warning("Please write a comment first."); return; }
    setSubmittingComment(true);
    try {
      await axiosClient.post(`portal/room-comments`, { roomId: id, comment: commentText });
      setCommentText("");
      toast.success("Comment posted!");
      await fetchFeedback(); // re-fetch so the new comment has a real _id and populated user
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err) ? err.response?.data?.message || "Failed to post comment." : "Something went wrong.";
      toast.error(msg);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await axiosClient.delete(`portal/room-comments/${commentId}`, { data: { roomId: id } });
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      toast.success("Comment deleted.");
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err) ? err.response?.data?.message || "Failed to delete comment." : "Something went wrong.";
      toast.error(msg);
    }
  };

  const handleUpdateComment = async (commentId: string, newText: string) => {
    try {
      const res = await axiosClient.patch(`portal/room-comments/${commentId}`, { comment: newText });
      const updated: Comment = res.data?.data?.comment ?? res.data?.data;
      setComments((prev) => prev.map((c) => c._id === commentId ? { ...c, comment: updated?.comment ?? newText } : c));
      toast.success("Comment updated.");
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err) ? err.response?.data?.message || "Failed to update comment." : "Something went wrong.";
      toast.error(msg);
    }
  };

  // ── Fetch room ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchRoom = async () => {
      setLoading(true);
      try {
        const res = await axiosClient.get(`portal/rooms/${id}`);
        setRoom(res.data?.data?.room ?? null);
      } catch (err: unknown) {
        const msg = axios.isAxiosError(err) ? err.response?.data?.message || "Failed to load room." : "Something went wrong.";
        setError(msg);
      } finally { setLoading(false); }
    };
    if (id) fetchRoom();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ maxWidth: 1180, mx: "auto", p: { xs: 2, md: 4 } }}>
        <Skeleton variant="text" width={140} height={18} sx={{ mb: 2 }} />
        <Skeleton variant="text" width={220} height={32} sx={{ mx: "auto", mb: 3 }} />
        <Grid container spacing={1.5}>
          <Grid size={{ xs: 12, sm: 7 }}><Skeleton variant="rounded" height={460} sx={{ borderRadius: 2 }} /></Grid>
          <Grid size={{ xs: 12, sm: 5 }}>
            <Skeleton variant="rounded" height={222} sx={{ borderRadius: 2, mb: 1.5 }} />
            <Skeleton variant="rounded" height={222} sx={{ borderRadius: 2 }} />
          </Grid>
        </Grid>
      </Box>
    );
  }

  if (error || !room) {
    return (
      <Box sx={{ maxWidth: 600, mx: "auto", textAlign: "center", py: 10 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Room not found</Typography>
        <Typography color="text.secondary">{error || "This room may have been removed or is no longer available."}</Typography>
      </Box>
    );
  }

  const finalPrice = room.discount > 0 ? Math.round(room.price * (1 - room.discount / 100)) : room.price;

  const handleBookingClick = () => {
    if (!isLoggedIn) { navigate("/auth/login"); return; }
    if (!checkIn || !checkOut) {
      toast.warning("Please select check-in and check-out dates first.");
      return;
    }

    const oneDay = 24 * 60 * 60 * 1000;
    const diffTime = checkOut.getTime() - checkIn.getTime();
    const diffDays = Math.round(diffTime / oneDay);
    const nights = diffDays > 0 ? diffDays : 1;

    const formatDate = (d: Date) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const subTotal = finalPrice * nights;
    const tax = subTotal * 0.1;
    const total = subTotal + tax;

    navigate("/bookingPayment", {
      state: {
        room: {
          _id: room._id,
          roomNumber: room.roomNumber,
          price: room.price,
          discount: room.discount,
          capacity: room.capacity,
          images: room.images,
        },
        startDate: formatDate(checkIn),
        endDate: formatDate(checkOut),
        nights,
        subTotal,
        tax,
        total,
      },
    });
  };

  const mainImage = galleryImages[activeImage];
  const sideImages = galleryImages.filter((_, i) => i !== activeImage).slice(0, 2);
  const displayFacilities = room.facilities?.length
    ? room.facilities
    : [{ _id: "cap", name: `${room.capacity} ${room.capacity === 1 ? "Guest" : "Guests"}` }];

  const hasMoreComments = comments.length > 2;

  return (
    <Box sx={{ maxWidth: 1180, mx: "auto", p: { xs: 2, sm: 3, md: 4 }, bgcolor: "#fff" }}>

      {/* Breadcrumb */}
      <Typography sx={{ fontSize: 12.5, color: "#9A97AE", mb: 2 }}>
        Home / <Box component="span" sx={{ color: "#3D2EBF", fontWeight: 600 }}>Room Details</Box>
      </Typography>

      {/* Title */}
      <Box sx={{ textAlign: "center", mb: 3 }}>
        <Typography sx={{ fontSize: 22, fontWeight: 800, color: "#1F1B3C" }}>Room {room.roomNumber}</Typography>
        <Typography sx={{ fontSize: 12.5, color: "#9A97AE", mt: 0.3 }}>Hosted by {room.createdBy?.userName ?? "the property"}</Typography>
      </Box>

      {/* Gallery */}
      <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 1.5, height: { xs: "auto", sm: 460 }, mb: 4 }}>
        <Box sx={{ flex: { xs: "0 0 auto", sm: "0 0 58%" }, height: { xs: 320, sm: "100%" }, borderRadius: 2, overflow: "hidden", bgcolor: "#F3F1FB", position: "relative", "&:hover .lightbox-trigger": { opacity: 1 } }}>
          {mainImage ? (
            <>
              <Box component="img" src={mainImage} alt={`Room ${room.roomNumber}`} onClick={() => openLightbox(activeImage)} onError={(e: React.SyntheticEvent<HTMLImageElement>) => { e.currentTarget.src = "https://placehold.co/700x500?text=Room"; }} sx={{ width: "100%", height: "100%", objectFit: "cover", cursor: "pointer" }} />
              <IconButton
                className="lightbox-trigger"
                onClick={() => openLightbox(activeImage)}
                size="small"
                sx={{
                  position: "absolute", bottom: 10, right: 10,
                  color: "#fff", bgcolor: "rgba(20,16,40,0.55)",
                  opacity: { xs: 1, sm: 0 }, transition: "opacity 0.2s",
                  "&:hover": { bgcolor: "rgba(20,16,40,0.75)" },
                }}
              >
                <OpenInFullIcon sx={{ fontSize: 15 }} />
              </IconButton>
            </>
          ) : (
            <Box sx={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Typography sx={{ fontSize: 13, color: "text.disabled" }}>No images available</Typography>
            </Box>
          )}
        </Box>
        <Box sx={{ flex: { xs: "0 0 auto", sm: "1 1 auto" }, display: "flex", flexDirection: "column", gap: 1, height: { xs: "auto", sm: "100%" } }}>
          {sideImages.length > 0 ? (
            sideImages.map((src, i) => (
              <Box key={i} sx={{ flex: "1 1 0", height: { xs: 155, sm: "auto" }, borderRadius: 2, overflow: "hidden", position: "relative", bgcolor: "#F3F1FB", "&:hover .lightbox-trigger": { opacity: 1 } }}>
                <Box component="img" src={src} onClick={() => setActiveImage(galleryImages.indexOf(src))} onError={(e: React.SyntheticEvent<HTMLImageElement>) => { e.currentTarget.src = "https://placehold.co/400x300?text=Room"; }} sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block", cursor: "pointer" }} />
                <IconButton
                  className="lightbox-trigger"
                  onClick={() => openLightbox(galleryImages.indexOf(src))}
                  size="small"
                  sx={{
                    position: "absolute", bottom: 6, right: 6,
                    color: "#fff", bgcolor: "rgba(20,16,40,0.55)",
                    opacity: { xs: 1, sm: 0 }, transition: "opacity 0.2s",
                    "&:hover": { bgcolor: "rgba(20,16,40,0.75)" },
                  }}
                >
                  <OpenInFullIcon sx={{ fontSize: 13 }} />
                </IconButton>
              </Box>
            ))
          ) : (
            <>
              <Skeleton variant="rounded" sx={{ flex: "1 1 0", borderRadius: 2 }} />
              <Skeleton variant="rounded" sx={{ flex: "1 1 0", borderRadius: 2 }} />
            </>
          )}
        </Box>
      </Box>

      {/* Body */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 7 }}>
          <Typography sx={{ fontSize: 12.5, color: "#6B6880", lineHeight: 1.9, mb: 1.5 }}>
            A comfortable, well-appointed room designed for relaxation and convenience.
          </Typography>
          <Typography sx={{ fontSize: 12.5, color: "#6B6880", lineHeight: 1.9, mb: 1.5 }}>
            Featuring thoughtful amenities and a calm atmosphere, it's an ideal space whether you're staying for business or leisure.
          </Typography>
          <Typography sx={{ fontSize: 12.5, color: "#6B6880", lineHeight: 1.9, mb: 3 }}>
            Every detail has been considered to make your stay feel effortless, from the layout of the space to the quality of the furnishings.
          </Typography>

          <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#1F1B3C", mb: 1.5 }}>What this room offers</Typography>
          <Grid container spacing={1.5}>
            <Grid size={{ xs: 6, sm: 3 }}><FacilityPill icon={<BedOutlinedIcon sx={{ fontSize: 18 }} />} value="1" label="Bedroom" /></Grid>
            <Grid size={{ xs: 6, sm: 3 }}><FacilityPill icon={<WeekendOutlinedIcon sx={{ fontSize: 18 }} />} value="1" label="Living room" /></Grid>
            <Grid size={{ xs: 6, sm: 3 }}><FacilityPill icon={<BathtubOutlinedIcon sx={{ fontSize: 18 }} />} value="1" label="Bathroom" /></Grid>
            <Grid size={{ xs: 6, sm: 3 }}><FacilityPill icon={<RestaurantOutlinedIcon sx={{ fontSize: 18 }} />} value="1" label="Dining room" /></Grid>
            {displayFacilities.map((f) => (
              <Grid size={{ xs: 6, sm: 3 }} key={f._id}><FacilityPill icon={facilityIcon(f.name)} label={f.name} /></Grid>
            ))}
          </Grid>
        </Grid>

        {/* Booking card */}
        <Grid size={{ xs: 12, sm: 5 }}>
          <Paper elevation={0} sx={{ borderRadius: 2.5, border: "1px solid #EFEDF8", p: 2.5, boxShadow: "0 8px 24px -12px rgba(70,40,200,0.12)" }}>
            <Typography sx={{ fontSize: 13, color: "#1F1B3C", fontWeight: 700, mb: 1.5 }}>Start Booking</Typography>
            <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.8, mb: 0.4 }}>
              <Typography sx={{ fontSize: 24, fontWeight: 800, color: "#16A34A" }}>${room.price}</Typography>
              <Typography sx={{ fontSize: 12.5, color: "#9A97AE" }}>per night</Typography>
            </Box>
            {room.discount > 0 && (
              <Typography sx={{ fontSize: 12, color: "#E0473E", fontWeight: 600, mb: 2 }}>Discount {room.discount}% Off</Typography>
            )}
            <Typography sx={{ fontSize: 11.5, color: "#9A97AE", fontWeight: 600, mb: 0.8, mt: 8 }}>Pick a Date</Typography>
            <Box onClick={openDatePicker} sx={{ display: "flex", alignItems: "center", gap: 1, border: "1px solid #EFEDF8", borderRadius: 1.5, px: 1.5, py: 1, mb: 2, cursor: "pointer", transition: "border-color 0.15s", "&:hover": { borderColor: "#D9D3F7" } }}>
              <CalendarMonthOutlinedIcon sx={{ fontSize: 17, color: "#3D2EBF" }} />
              <Typography sx={{ fontSize: 12.5, color: checkIn ? "#1F1B3C" : "#9A97AE", fontWeight: 500 }}>
                {checkIn && checkOut ? `${formatShort(checkIn)} – ${formatShort(checkOut)}` : checkIn ? `${formatShort(checkIn)} – Select check-out` : "Select dates"}
              </Typography>
            </Box>
            <Popover open={Boolean(dateAnchor)} anchorEl={dateAnchor} onClose={closeDatePicker} anchorOrigin={{ vertical: "bottom", horizontal: "left" }} transformOrigin={{ vertical: "top", horizontal: "left" }} slotProps={{ paper: { sx: { borderRadius: 2, border: "1px solid #EFEDF8", boxShadow: "0 12px 32px -16px rgba(70,40,200,0.25)" } } }}>
              <DateRangeCalendar checkIn={checkIn} checkOut={checkOut} onSelect={handleDateSelect} />
            </Popover>
            <Typography sx={{ fontSize: 12, color: "#6B6880", mb: 2 }}>
              You will pay <Box component="span" sx={{ fontWeight: 700, color: "#1F1B3C" }}>${finalPrice}</Box> USD for {room.capacity} {room.capacity === 1 ? "Person" : "People"}
            </Typography>
            <Button fullWidth variant="contained" onClick={handleBookingClick} onMouseEnter={() => !isLoggedIn && setBookHover(true)} onMouseLeave={() => !isLoggedIn && setBookHover(false)} sx={{ position: "relative", overflow: "hidden", borderRadius: 1.5, textTransform: "none", fontWeight: 700, bgcolor: "#3D2EBF", py: 1.2, fontSize: 14, "&:hover": { bgcolor: "#2F23A0" } }}>
              <Box component="span" sx={{ display: "block", transform: !isLoggedIn && bookHover ? "translateY(-150%)" : "translateY(0)", opacity: !isLoggedIn && bookHover ? 0 : 1, transition: "transform 0.3s ease, opacity 0.25s ease" }}>Continue Book</Box>
              <Box component="span" sx={{ position: "absolute", left: 0, right: 0, transform: !isLoggedIn && bookHover ? "translateY(0)" : "translateY(150%)", opacity: !isLoggedIn && bookHover ? 1 : 0, transition: "transform 0.3s ease, opacity 0.25s ease" }}>Login to Book</Box>
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* ── Rate & Comment ── */}
      {isLoggedIn && (
        <Box sx={{ mt: 5 }}>
          <Divider sx={{ mb: 4 }} />
          <Grid container spacing={4}>

            {/* Left: Rate */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography sx={{ fontSize: 12.5, color: "#9A97AE", fontWeight: 600, mb: 0.5 }}>Rate</Typography>
              <Rating value={rateValue} onChange={(_, newValue) => setRateValue(newValue)} sx={{ mb: 2, fontSize: 26, color: "#FFC107" }} />
              <Typography sx={{ fontSize: 12.5, color: "#9A97AE", fontWeight: 600, mb: 0.8 }}>Message</Typography>
              <TextField
                fullWidth multiline rows={3}
                placeholder="Share your experience…"
                value={rateMessage}
                onChange={(e) => setRateMessage(e.target.value)}
                sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: 2, fontSize: 12.5, "& fieldset": { borderColor: "#D9D3F7" } } }}
              />
              <Button variant="contained" onClick={handleSubmitReview} disabled={submittingReview}
                sx={{ borderRadius: 1.5, textTransform: "none", fontWeight: 700, bgcolor: "#3D2EBF", px: 3, py: 0.9, fontSize: 13, "&:hover": { bgcolor: "#2F23A0" } }}
                startIcon={submittingReview ? <CircularProgress size={14} color="inherit" /> : null}
              >
                {submittingReview ? "Sending…" : "Rate"}
              </Button>

              {/* Reviews list — read only */}
              {loadingFeedback ? (
                <Box sx={{ mt: 2 }}>
                  <Skeleton variant="rounded" height={48} sx={{ mb: 1, borderRadius: 2 }} />
                  <Skeleton variant="rounded" height={48} sx={{ borderRadius: 2 }} />
                </Box>
              ) : reviews.length > 0 ? (
                <Box sx={{ mt: 2 }}>
                  {reviews.map((r) => (
                    <ReviewItem
                      key={r._id}
                      name={r.user?.userName ?? r.createdBy?.userName ?? "Guest"}
                      content={r.review}
                      rate={r.rating}
                    />
                  ))}
                </Box>
              ) : null}
            </Grid>

            {/* Right: Comments */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography sx={{ fontSize: 12.5, color: "#9A97AE", fontWeight: 600, mb: 0.8, mt: 8 }}>Add Your Comment</Typography>
              <TextField
                fullWidth multiline rows={5}
                placeholder="Write a comment…"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: 2, fontSize: 12.5, "& fieldset": { borderColor: "#D9D3F7" } } }}
              />
              <Button variant="contained" onClick={handleSubmitComment} disabled={submittingComment}
                sx={{ borderRadius: 1.5, textTransform: "none", fontWeight: 700, bgcolor: "#3D2EBF", px: 3, py: 0.9, fontSize: 13, "&:hover": { bgcolor: "#2F23A0" } }}
                startIcon={submittingComment ? <CircularProgress size={14} color="inherit" /> : null}
              >
                {submittingComment ? "Sending…" : "Send"}
              </Button>

              {/* Comments list — with edit/delete + show more */}
              {loadingFeedback ? (
                <Box sx={{ mt: 2 }}>
                  <Skeleton variant="rounded" height={64} sx={{ mb: 1, borderRadius: 2 }} />
                  <Skeleton variant="rounded" height={64} sx={{ borderRadius: 2 }} />
                </Box>
              ) : comments.length > 0 ? (
                <Box sx={{ mt: 2 }}>
                  {/* Always show first 2 */}
                  {comments.slice(0, 2).map((c) => (
                    <CommentItem
                      key={c._id}
                      name={c.user?.userName ?? "Guest"}
                      content={c.comment}
                      isOwner={isMine(c.user)}
                      onDelete={() => handleDeleteComment(c._id)}
                      onEdit={(newText) => handleUpdateComment(c._id, newText)}
                    />
                  ))}

                  {/* Collapsible extra comments */}
                  {hasMoreComments && (
                    <>
                      <Collapse in={showAllComments}>
                        {comments.slice(2).map((c) => (
                          <CommentItem
                            key={c._id}
                            name={c.user?.userName ?? "Guest"}
                            content={c.comment}
                            isOwner={isMine(c.user)}
                            onDelete={() => handleDeleteComment(c._id)}
                            onEdit={(newText) => handleUpdateComment(c._id, newText)}
                          />
                        ))}
                      </Collapse>

                      <Button
                        fullWidth
                        onClick={() => setShowAllComments((prev) => !prev)}
                        endIcon={showAllComments ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        sx={{
                          mt: 0.5, textTransform: "none", fontSize: 12, fontWeight: 600,
                          color: "#3D2EBF", borderRadius: 2,
                          border: "1px dashed #D9D3F7",
                          py: 0.8,
                          "&:hover": { bgcolor: "#F3F1FB", borderColor: "#B8B0F0" },
                        }}
                      >
                        {showAllComments
                          ? "Show less"
                          : `Show ${comments.length - 2} more comment${comments.length - 2 > 1 ? "s" : ""}`}
                      </Button>
                    </>
                  )}
                </Box>
              ) : null}
            </Grid>
          </Grid>
        </Box>
      )}

      {/* ── Image Lightbox ── */}
      {lightboxOpen && galleryImages.length > 0 && (
        <Box
          onClick={closeLightbox}
          sx={{
            position: "fixed", inset: 0, zIndex: 1300,
            bgcolor: "rgba(15, 13, 30, 0.92)",
            display: "flex", alignItems: "center", justifyContent: "center",
            p: { xs: 2, sm: 4 },
          }}
        >
          <IconButton
            onClick={closeLightbox}
            sx={{
              position: "absolute", top: 16, right: 16,
              color: "#fff", bgcolor: "rgba(255,255,255,0.1)",
              "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
            }}
          >
            <CloseIcon />
          </IconButton>

          <Typography sx={{ position: "absolute", top: 22, left: 20, color: "#fff", fontSize: 13, fontWeight: 600 }}>
            {lightboxIndex + 1} / {galleryImages.length}
          </Typography>

          {galleryImages.length > 1 && (
            <IconButton
              onClick={(e) => { e.stopPropagation(); lightboxPrev(); }}
              sx={{
                position: "absolute", left: { xs: 6, sm: 24 }, top: "50%", transform: "translateY(-50%)",
                color: "#fff", bgcolor: "rgba(255,255,255,0.1)",
                "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
              }}
            >
              <ChevronLeftIcon />
            </IconButton>
          )}

          <Box
            component="img"
            src={galleryImages[lightboxIndex]}
            alt={`Room ${room.roomNumber} photo ${lightboxIndex + 1}`}
            onClick={(e) => e.stopPropagation()}
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => { e.currentTarget.src = "https://placehold.co/900x600?text=Room"; }}
            sx={{
              maxWidth: "100%", maxHeight: "85vh", objectFit: "contain",
              borderRadius: 2, boxShadow: "0 20px 60px -20px rgba(0,0,0,0.5)",
            }}
          />

          {galleryImages.length > 1 && (
            <IconButton
              onClick={(e) => { e.stopPropagation(); lightboxNext(); }}
              sx={{
                position: "absolute", right: { xs: 6, sm: 24 }, top: "50%", transform: "translateY(-50%)",
                color: "#fff", bgcolor: "rgba(255,255,255,0.1)",
                "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
              }}
            >
              <ChevronRightIcon />
            </IconButton>
          )}

          {galleryImages.length > 1 && (
            <Box
              onClick={(e) => e.stopPropagation()}
              sx={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 0.8 }}
            >
              {galleryImages.map((_, i) => (
                <Box
                  key={i}
                  onClick={() => setLightboxIndex(i)}
                  sx={{
                    width: 7, height: 7, borderRadius: "50%", cursor: "pointer",
                    bgcolor: i === lightboxIndex ? "#fff" : "rgba(255,255,255,0.4)",
                    transition: "background-color 0.2s",
                  }}
                />
              ))}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}