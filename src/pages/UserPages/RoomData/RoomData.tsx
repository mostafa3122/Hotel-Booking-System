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
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
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
import ZoomInOutlinedIcon from "@mui/icons-material/ZoomInOutlined";

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
const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAY_NAMES = ["Su","Mo","Tu","We","Th","Fr","Sa"];

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

function ImageLightbox({
  images,
  index,
  open,
  onClose,
  onIndexChange,
}: {
  images: string[];
  index: number;
  open: boolean;
  onClose: () => void;
  onIndexChange: (i: number) => void;
}) {
  const goPrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    onIndexChange(index === 0 ? images.length - 1 : index - 1);
  };
  const goNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    onIndexChange(index === images.length - 1 ? 0 : index + 1);
  };
 
  // Keyboard navigation: Esc to close, arrows to navigate
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, index, images.length]);
 
  if (!images.length) return null;
 
  return (
    <Modal open={open} onClose={onClose} closeAfterTransition>
      <Fade in={open}>
        <Box
          onClick={onClose}
          sx={{
            position: "fixed", inset: 0,
            bgcolor: "rgba(10, 8, 20, 0.92)",
            display: "flex", alignItems: "center", justifyContent: "center",
            outline: "none",
          }}
        >
          {/* Close button */}
          <IconButton
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            sx={{
              position: "absolute", top: { xs: 12, sm: 24 }, right: { xs: 12, sm: 24 },
              color: "#fff", bgcolor: "rgba(255,255,255,0.08)",
              "&:hover": { bgcolor: "rgba(255,255,255,0.18)" },
            }}
          >
            <CloseIcon />
          </IconButton>
 
          {/* Counter */}
          <Typography
            sx={{
              position: "absolute", top: { xs: 14, sm: 28 }, left: { xs: 16, sm: 28 },
              color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: 600,
            }}
          >
            {index + 1} / {images.length}
          </Typography>
 
          {/* Prev arrow */}
          {images.length > 1 && (
            <IconButton
              onClick={goPrev}
              sx={{
                position: "absolute", left: { xs: 8, sm: 24 }, top: "50%", transform: "translateY(-50%)",
                color: "#fff", bgcolor: "rgba(255,255,255,0.08)",
                "&:hover": { bgcolor: "rgba(255,255,255,0.18)" },
              }}
            >
              <ChevronLeftIcon fontSize="large" />
            </IconButton>
          )}
 
          {/* Main image */}
          <Box
            component="img"
            onClick={(e) => e.stopPropagation()}
            src={images[index]}
            alt={`Gallery image ${index + 1}`}
            sx={{
              maxWidth: { xs: "92vw", sm: "82vw" },
              maxHeight: { xs: "70vh", sm: "78vh" },
              objectFit: "contain",
              borderRadius: 2,
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            }}
          />
 
          {/* Next arrow */}
          {images.length > 1 && (
            <IconButton
              onClick={goNext}
              sx={{
                position: "absolute", right: { xs: 8, sm: 24 }, top: "50%", transform: "translateY(-50%)",
                color: "#fff", bgcolor: "rgba(255,255,255,0.08)",
                "&:hover": { bgcolor: "rgba(255,255,255,0.18)" },
              }}
            >
              <ChevronRightIcon fontSize="large" />
            </IconButton>
          )}
 
          {/* Thumbnail strip */}
          {images.length > 1 && (
            <Box
              onClick={(e) => e.stopPropagation()}
              sx={{
                position: "absolute", bottom: { xs: 14, sm: 28 },
                display: "flex", gap: 1, maxWidth: "90vw", overflowX: "auto", px: 1, py: 0.5,
              }}
            >
              {images.map((src, i) => (
                <Box
                  key={i}
                  component="img"
                  src={src}
                  onClick={() => onIndexChange(i)}
                  sx={{
                    width: 56, height: 42, objectFit: "cover", borderRadius: 1.2,
                    cursor: "pointer", flexShrink: 0,
                    border: i === index ? "2px solid #fff" : "2px solid transparent",
                    opacity: i === index ? 1 : 0.55,
                    transition: "opacity 0.15s, border-color 0.15s",
                    "&:hover": { opacity: 1 },
                  }}
                />
              ))}
            </Box>
          )}
        </Box>
      </Fade>
    </Modal>
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

  // ── Lightbox state ─────────────────────────────────────────────────────────
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
 
  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

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
  useEffect(() => {
    if (!isLoggedIn || !id) return;
    const fetchFeedback = async () => {
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
      const res = await axiosClient.post(`portal/room-reviews`, { roomId: id, rating: rateValue, review: rateMessage });
      const created: Review = res.data?.data?.review ?? res.data?.data;
      if (created) setReviews((prev) => [created, ...prev]);
      setRateValue(0); setRateMessage("");
      toast.success("Thanks for your rating!");
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
    const res = await axiosClient.post(`portal/room-comments`, { roomId: id, comment: commentText });

    // Don't trust the response shape for display fields — pull only the id (if present),
    // and build the rest from what we already know locally.
    const raw = res.data?.data?.comment ?? res.data?.data ?? {};
    const newId = raw._id ?? raw.id ?? `temp-${Date.now()}`;

    const newComment: Comment = {
      _id: newId,
      comment: commentText,
      user: { _id: userData!._id, userName: userData!.userName },
      createdAt: new Date().toISOString(),
    };

    setComments((prev) => [newComment, ...prev]);
    setCommentText("");
    toast.success("Comment posted!");
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
    navigate("/bookingPayment", { state: { roomId: room._id, checkIn, checkOut, price: finalPrice } });
  };

  const gallery = room.images?.length ? room.images : [];
  const mainImage = gallery[activeImage];
  const sideImages = gallery.filter((_, i) => i !== activeImage).slice(0, 2);
  const displayFacilities = room.facilities?.length
    ? room.facilities
    : [{ _id: "cap", name: `${room.capacity} ${room.capacity === 1 ? "Guest" : "Guests"}` }];

  const visibleComments = showAllComments ? comments : comments.slice(0, 2);
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
        <Box
          onClick={() => mainImage && openLightbox(activeImage)}
          sx={{
            position: "relative",
            flex: { xs: "0 0 auto", sm: "0 0 58%" }, height: { xs: 320, sm: "100%" },
            borderRadius: 2, overflow: "hidden", bgcolor: "#F3F1FB",
            cursor: mainImage ? "pointer" : "default",
            "&:hover .lightbox-hint": { opacity: 1 },
          }}
        >
          {mainImage ? (
            <>
              <Box component="img" src={mainImage} alt={`Room ${room.roomNumber}`} onError={(e: React.SyntheticEvent<HTMLImageElement>) => { e.currentTarget.src = "https://placehold.co/700x500?text=Room"; }} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
              {/* Zoom hint overlay */}
              <Box
                className="lightbox-hint"
                sx={{
                  position: "absolute", inset: 0,
                  bgcolor: "rgba(10,8,20,0.0)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  opacity: 0, transition: "opacity 0.2s, background-color 0.2s",
                  "&:hover": { bgcolor: "rgba(10,8,20,0.25)" },
                }}
              >
                <Box
                  sx={{
                    width: 44, height: 44, borderRadius: "50%",
                    bgcolor: "rgba(255,255,255,0.9)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#3D2EBF",
                  }}
                >
                  <ZoomInOutlinedIcon />
                </Box>
              </Box>
            </>
          ) : (
            <Box sx={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Typography sx={{ fontSize: 13, color: "text.disabled" }}>No images available</Typography>
            </Box>
          )}
        </Box>
        <Box sx={{ flex: { xs: "0 0 auto", sm: "1 1 auto" }, display: "flex", flexDirection: "column", gap: 1, height: { xs: "auto", sm: "100%" } }}>
          {sideImages.length > 0 ? (
            sideImages.map((src, i) => {
              const realIdx = gallery.indexOf(src);
              return (
                <Box
                  key={i}
                  onClick={() => openLightbox(realIdx)}
                  sx={{
                    position: "relative",
                    flex: "1 1 0", height: { xs: 155, sm: "auto" },
                    borderRadius: 2, overflow: "hidden", cursor: "pointer", bgcolor: "#F3F1FB",
                    "&:hover .lightbox-hint-small": { opacity: 1 },
                  }}
                >
                  <Box component="img" src={src} onError={(e: React.SyntheticEvent<HTMLImageElement>) => { e.currentTarget.src = "https://placehold.co/400x300?text=Room"; }} sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  <Box
                    className="lightbox-hint-small"
                    sx={{
                      position: "absolute", inset: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      opacity: 0, transition: "opacity 0.2s, background-color 0.2s",
                      "&:hover": { bgcolor: "rgba(10,8,20,0.25)" },
                    }}
                  >
                    <ZoomInOutlinedIcon sx={{ color: "#fff", fontSize: 20 }} />
                  </Box>
                </Box>
              );
            })
          ) : (
            <>
              <Skeleton variant="rounded" sx={{ flex: "1 1 0", borderRadius: 2 }} />
              <Skeleton variant="rounded" sx={{ flex: "1 1 0", borderRadius: 2 }} />
            </>
          )}
        </Box>
      </Box>
 
      {/* Lightbox modal */}
      <ImageLightbox
        images={gallery}
        index={lightboxIndex}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onIndexChange={setLightboxIndex}
      />

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
          <Paper elevation={0} sx={{ borderRadius: 2.5, border: "1px solid #EFEDF8", p: 5, boxShadow: "0 8px 24px -12px rgba(70,40,200,0.12)" }}>
            <Typography sx={{ fontSize: 13, color: "#1F1B3C", fontWeight: 700, mb: 1.5 }}>Start Booking</Typography>
            <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.8, mb: 0.4 }}>
              <Typography sx={{ fontSize: 24, fontWeight: 800, color: "#16A34A" }}>${room.price}</Typography>
              <Typography sx={{ fontSize: 12.5, color: "#9A97AE" }}>per night</Typography>
            </Box>
            {room.discount > 0 && (
              <Typography sx={{ fontSize: 12, color: "#E0473E", fontWeight: 600, mb: 5 }}>Discount {room.discount}% Off</Typography>
            )}
            <Typography sx={{ fontSize: 11.5, color: "#9A97AE", fontWeight: 600, mb: 0.8 }}>Pick a Date</Typography>
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
              <Typography sx={{ fontSize: 12.5, color: "#9A97AE", fontWeight: 600, mb: 0.8 ,mt:8 }}>Add Your Comment</Typography>
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
    </Box>
  );
}