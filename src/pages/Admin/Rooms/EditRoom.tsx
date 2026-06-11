import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import axiosClient from "../../../services/api/axiosClient";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

// MUI
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import Autocomplete from "@mui/material/Autocomplete";
import type { AutocompleteRenderGetTagProps } from "@mui/material";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";

// Icons
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Facility {
  _id: string;
  name: string;
}

// ── Shared sx ─────────────────────────────────────────────────────────────────
const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    backgroundColor: "#f9fafb",
    "& fieldset": { borderColor: "#e5e7eb" },
    "&:hover fieldset": { borderColor: "#3b82f6" },
    "&.Mui-focused fieldset": { borderColor: "#2563eb" },
  },
};

// ── Image Upload Zone ─────────────────────────────────────────────────────────
function ImageUploadZone({
  existingUrls,
  newFiles,
  onRemoveExisting,
  onChangeNew,
}: {
  existingUrls: string[];
  newFiles: File[];
  onRemoveExisting: (idx: number) => void;
  onChangeNew: (files: File[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    const valid = Array.from(incoming).filter((f) => f.type.startsWith("image/"));
    onChangeNew([...newFiles, ...valid]);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      addFiles(e.dataTransfer.files);
    },
    [newFiles]
  );

  const removeNew = (idx: number) => {
    onChangeNew(newFiles.filter((_, i) => i !== idx));
  };

  const totalCount = existingUrls.length + newFiles.length;

  return (
    <Box>
      {/* Drop zone */}
      <Box
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        sx={{
          border: `2px dashed ${dragging ? "#22c55e" : "#86efac"}`,
          borderRadius: 2,
          bgcolor: "#f0fdf4",
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1,
          cursor: "pointer",
          transition: "all 0.2s",
          "&:hover": { bgcolor: "#dcfce7", borderColor: "#22c55e" },
        }}
      >
        <input
          ref={inputRef}
          type="file"
          hidden
          multiple
          accept="image/*"
          onChange={(e) => addFiles(e.target.files)}
        />
        <CloudUploadIcon sx={{ fontSize: 38, color: "#22c55e" }} />
        <Typography variant="body2" color="text.secondary" textAlign="center">
          Drag & Drop or{" "}
          <Box component="span" sx={{ color: "#2563eb", fontWeight: 600 }}>
            Choose images
          </Box>{" "}
          to add more
        </Typography>
        <Typography variant="caption" color="text.disabled">
          PNG, JPG, WEBP — {totalCount} image{totalCount !== 1 ? "s" : ""} total
        </Typography>
      </Box>

      {/* Existing images (from server) */}
      {existingUrls.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" sx={{ color: "text.disabled", mb: 1, display: "block" }}>
            Current images — click ✕ to remove
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
            {existingUrls.map((src, i) => (
              <Box key={`existing-${i}`} sx={{ position: "relative", width: 88, height: 88 }}>
                <Box
                  component="img"
                  src={src}
                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                    e.currentTarget.src = "https://placehold.co/88x88?text=img";
                  }}
                  sx={{
                    width: "100%", height: "100%", objectFit: "cover",
                    borderRadius: 2, border: "2px solid #e5e7eb",
                  }}
                />
                <IconButton
                  size="small"
                  onClick={(ev) => { ev.stopPropagation(); onRemoveExisting(i); }}
                  sx={{
                    position: "absolute", top: -7, right: -7,
                    bgcolor: "#ef4444", color: "#fff", width: 22, height: 22,
                    "&:hover": { bgcolor: "#dc2626" },
                  }}
                >
                  <CloseIcon sx={{ fontSize: 13 }} />
                </IconButton>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* New files queued for upload */}
      {newFiles.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" sx={{ color: "#16a34a", fontWeight: 600, mb: 1, display: "block" }}>
            New images to upload ({newFiles.length})
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
            {newFiles.map((file, i) => (
              <Box key={`new-${i}`} sx={{ position: "relative", width: 88, height: 88 }}>
                <Box
                  component="img"
                  src={URL.createObjectURL(file)}
                  sx={{
                    width: "100%", height: "100%", objectFit: "cover",
                    borderRadius: 2, border: "2px solid #22c55e",
                  }}
                />
                {/* New badge */}
                <Box sx={{
                  position: "absolute", bottom: 4, left: 4,
                  bgcolor: "#22c55e", color: "#fff",
                  fontSize: 9, fontWeight: 700, px: 0.6, py: 0.2,
                  borderRadius: 0.5, lineHeight: 1.4,
                }}>
                  NEW
                </Box>
                <IconButton
                  size="small"
                  onClick={(ev) => { ev.stopPropagation(); removeNew(i); }}
                  sx={{
                    position: "absolute", top: -7, right: -7,
                    bgcolor: "#ef4444", color: "#fff", width: 22, height: 22,
                    "&:hover": { bgcolor: "#dc2626" },
                  }}
                >
                  <CloseIcon sx={{ fontSize: 13 }} />
                </IconButton>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* Empty state warning */}
      {totalCount === 0 && (
        <Box sx={{ mt: 1.5, p: 1.5, bgcolor: "#fef2f2", borderRadius: 1.5, border: "1px solid #fecaca" }}>
          <Typography variant="caption" sx={{ color: "#dc2626", fontWeight: 500 }}>
            At least one image is required.
          </Typography>
        </Box>
      )}
    </Box>
  );
}

// ── Edit Room Page ────────────────────────────────────────────────────────────
const EditRoom = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState({ roomNumber: "", price: "", capacity: "", discount: "" });
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);

  const [allFacilities, setAllFacilities] = useState<Facility[]>([]);
  const [selectedFacilities, setSelectedFacilities] = useState<Facility[]>([]);
  const [loadingFacilities, setLoadingFacilities] = useState(false);

  const [loadingRoom, setLoadingRoom] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ── Fetch room + facilities ──────────────────────────────────────────────
  useEffect(() => {
    const fetchAll = async () => {
      setLoadingRoom(true);
      setLoadingFacilities(true);
      try {
        const [roomRes, facRes] = await Promise.all([
          axiosClient.get(`admin/rooms/${id}`),
          axiosClient.get("admin/room-facilities", { params: { page: 1, size: 100 } }),
        ]);

        const roomPayload = roomRes.data?.data;
        const room = roomPayload?.room ?? roomPayload;

        setForm({
          roomNumber: room.roomNumber ?? "",
          price:      String(room.price ?? ""),
          capacity:   String(room.capacity ?? ""),
          discount:   String(room.discount ?? "0"),
        });
        setExistingImages(Array.isArray(room.images) ? room.images : []);

        const facPayload = facRes.data?.data;
        const facList: Facility[] = facPayload?.facilities ?? facPayload?.roomFacilities ?? facPayload ?? [];
        setAllFacilities(facList);

        const roomFacIds: string[] = (room.facilities ?? []).map((f: Facility) => f._id);
        setSelectedFacilities(facList.filter((f) => roomFacIds.includes(f._id)));
      } catch (err: unknown) {
        const msg = axios.isAxiosError(err)
          ? err.response?.data?.message || "Failed to load room."
          : "Something went wrong.";
        toast.error(msg);
        navigate("/dashboard/rooms");
      } finally {
        setLoadingRoom(false);
        setLoadingFacilities(false);
      }
    };
    if (id) fetchAll();
  }, [id]);

  // ── Validation ───────────────────────────────────────────────────────────
  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.price || isNaN(Number(form.price))) e.price = "Valid price is required.";
    if (!form.capacity || isNaN(Number(form.capacity))) e.capacity = "Valid capacity is required.";
    if (selectedFacilities.length === 0) e.facilities = "At least one facility is required.";
    return e;
  };

  // ── Submit ───────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    if (existingImages.length + newImages.length === 0) {
      toast.warning("Please keep or upload at least one room image.");
      return;
    }

    setIsSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("price",    form.price);
      fd.append("capacity", form.capacity);
      fd.append("discount", form.discount || "0");
      selectedFacilities.forEach((f) => fd.append("facilities", f._id));

      // API only accepts new File objects under "imgs"
      newImages.forEach((img) => fd.append("imgs", img));

      await axiosClient.put(`admin/rooms/${id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Room updated successfully!");
      navigate("/dashboard/rooms");
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.message || "Failed to update room."
        : "Something went wrong.";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Loading skeleton ─────────────────────────────────────────────────────
  if (loadingRoom) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "#f9fafb", display: "flex", flexDirection: "column", alignItems: "center", px: { xs: 2, sm: 3 }, py: { xs: 3, sm: 5 } }}>
        <Box sx={{ width: "100%", maxWidth: 720, mb: 3 }}>
          <Skeleton variant="rounded" height={40} width={220} />
        </Box>
        <Paper elevation={0} sx={{ borderRadius: 3, border: "1px solid #f3f4f6", p: { xs: 2.5, sm: 4 }, width: "100%", maxWidth: 720 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} variant="rounded" height={42} />)}
            <Skeleton variant="rounded" height={160} />
          </Box>
        </Paper>
      </Box>
    );
  }

  // ── Form ─────────────────────────────────────────────────────────────────
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f9fafb", display: "flex", flexDirection: "column", alignItems: "center", px: { xs: 2, sm: 3 }, py: { xs: 3, sm: 5 } }}>

      {/* Header */}
      <Box sx={{ width: "100%", maxWidth: 720, mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <IconButton
            onClick={() => navigate("/dashboard/rooms")}
            sx={{ bgcolor: "#fff", border: "1px solid #e5e7eb", borderRadius: 2, "&:hover": { bgcolor: "#f3f4f6" } }}
          >
            <ArrowBackIcon fontSize="small" />
          </IconButton>
          <Box>
            <Typography variant="h6" fontWeight={700} color="text.primary">Edit Room</Typography>
            <Typography variant="body2" color="text.secondary">
              Update the details for room {form.roomNumber}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Form Card */}
      <Paper elevation={0} sx={{ borderRadius: 3, border: "1px solid #f3f4f6", p: { xs: 2.5, sm: 4 }, width: "100%", maxWidth: 720 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>

          {/* Room Number */}
          <TextField
            label="Room Number" fullWidth size="small"
            value={form.roomNumber}
            onChange={(e) => { setForm((p) => ({ ...p, roomNumber: e.target.value })); setErrors((p) => ({ ...p, roomNumber: "" })); }}
            error={!!errors.roomNumber} helperText={errors.roomNumber}
            sx={inputSx}
          />

          {/* Price + Capacity */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Price" fullWidth size="small" type="number"
                value={form.price}
                onChange={(e) => { setForm((p) => ({ ...p, price: e.target.value })); setErrors((p) => ({ ...p, price: "" })); }}
                error={!!errors.price} helperText={errors.price}
                slotProps={{ input: { startAdornment: <InputAdornment position="start">$</InputAdornment> } }}
                sx={inputSx}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Capacity" fullWidth size="small" type="number"
                value={form.capacity}
                onChange={(e) => { setForm((p) => ({ ...p, capacity: e.target.value })); setErrors((p) => ({ ...p, capacity: "" })); }}
                error={!!errors.capacity} helperText={errors.capacity}
                sx={inputSx}
              />
            </Grid>
          </Grid>

          {/* Discount */}
          <TextField
            label="Discount (%)" fullWidth size="small" type="number"
            value={form.discount}
            onChange={(e) => setForm((p) => ({ ...p, discount: e.target.value }))}
            slotProps={{ input: { endAdornment: <InputAdornment position="end">%</InputAdornment> } }}
            sx={inputSx}
          />

          {/* Facilities */}
          <Autocomplete<Facility, true, false, false>
            multiple
            options={allFacilities}
            getOptionLabel={(o) => o.name}
            value={selectedFacilities}
            onChange={(_, v) => { setSelectedFacilities(v); setErrors((p) => ({ ...p, facilities: "" })); }}
            loading={loadingFacilities}
            isOptionEqualToValue={(o, v) => o._id === v._id}
            renderTags={(value: Facility[], getTagProps: AutocompleteRenderGetTagProps) =>
              value.map((option, index) => (
                <Chip
                  label={option.name} size="small"
                  {...getTagProps({ index })} key={option._id}
                  sx={{ bgcolor: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe", fontSize: 12 }}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Facilities"
                placeholder={selectedFacilities.length === 0 ? "Select facilities…" : ""}
                size="small"
                error={!!errors.facilities} helperText={errors.facilities}
                sx={inputSx}
                slotProps={{
                  input: {
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loadingFacilities && <CircularProgress size={14} />}
                        {params.InputProps?.endAdornment ?? null}
                      </>
                    ),
                  },
                }}
              />
            )}
          />

          {/* Images */}
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600, color: "text.secondary", mb: 1 }}>
              Room Images <Box component="span" sx={{ color: "error.main" }}>*</Box>
            </Typography>
            <ImageUploadZone
              existingUrls={existingImages}
              newFiles={newImages}
              onRemoveExisting={(i) => setExistingImages((p) => p.filter((_, idx) => idx !== i))}
              onChangeNew={setNewImages}
            />
          </Box>

          {/* Actions */}
          <Box sx={{ display: "flex", gap: 2, pt: 1 }}>
            <Button
              onClick={() => navigate("/dashboard/rooms")}
              fullWidth variant="outlined"
              sx={{ borderRadius: 2, textTransform: "none", borderColor: "#e5e7eb", color: "text.secondary", fontWeight: 600 }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              fullWidth variant="contained" disabled={isSubmitting}
              sx={{ borderRadius: 2, textTransform: "none", bgcolor: "#2563eb", "&:hover": { bgcolor: "#1d4ed8" }, fontWeight: 600 }}
              startIcon={isSubmitting ? <CircularProgress size={14} color="inherit" /> : null}
            >
              {isSubmitting ? "Saving…" : "Save Changes"}
            </Button>
          </Box>

        </Box>
      </Paper>
    </Box>
  );
};

export default EditRoom;