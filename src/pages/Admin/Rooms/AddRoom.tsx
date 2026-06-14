import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import axiosClient from "../../../services/api/axiosClient";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

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

// Icons
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Facility {
  _id: string;
  name: string;
}

// ── Shared TextField sx ───────────────────────────────────────────────────────
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
  files,
  onChange,
}: {
  files: File[];
  onChange: (files: File[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    const valid = Array.from(incoming).filter((f) => f.type.startsWith("image/"));
    onChange([...files, ...valid]);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      addFiles(e.dataTransfer.files);
    },
    [files]
  );

  const remove = (idx: number) => {
    onChange(files.filter((_, i) => i !== idx));
  };

  return (
    <Box>
      <Box
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        sx={{
          border: `2px dashed ${dragging ? "#22c55e" : "#86efac"}`,
          borderRadius: 2,
          bgcolor: "#f0fdf4",
          p: 5,
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
        <CloudUploadIcon sx={{ fontSize: 42, color: "#22c55e" }} />
        
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center" }}>
          Drag & Drop or{" "}
          <Box
            component="span"
            sx={{ color: "#2563eb", fontWeight: 600, cursor: "pointer" }}
          >
            Choose a Room Image
          </Box>{" "}
          to Upload
        </Typography>
        <Typography variant="caption" color="text.disabled">
          PNG, JPG, WEBP supported
        </Typography>
      </Box>

      {files.length > 0 && (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mt: 2 }}>
          {files.map((file, i) => (
            <Box key={i} sx={{ position: "relative", width: 80, height: 80 }}>
              <Box
                component="img"
                src={URL.createObjectURL(file)}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: 2,
                  border: "1px solid #e5e7eb",
                }}
              />
              <IconButton
                size="small"
                onClick={(ev) => { ev.stopPropagation(); remove(i); }}
                sx={{
                  position: "absolute",
                  top: -6,
                  right: -6,
                  bgcolor: "#ef4444",
                  color: "#fff",
                  width: 20,
                  height: 20,
                  "&:hover": { bgcolor: "#dc2626" },
                }}
              >
                <CloseIcon sx={{ fontSize: 12 }} />
              </IconButton>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}

// ── Add Room Page ─────────────────────────────────────────────────────────────
const AddRoom = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ roomNumber: "", price: "", capacity: "", discount: "" });
  const [images, setImages] = useState<File[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [selectedFacilities, setSelectedFacilities] = useState<Facility[]>([]);
  const [loadingFacilities, setLoadingFacilities] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchFacilities = async () => {
      setLoadingFacilities(true);
      try {
        const res = await axiosClient.get("admin/room-facilities", {
          params: { page: 1, size: 100 },
        });
        const payload = res.data?.data;
        setFacilities(payload?.facilities ?? payload?.roomFacilities ?? payload ?? []);
      } catch {
        toast.error("Failed to load facilities.");
      } finally {
        setLoadingFacilities(false);
      }
    };
    fetchFacilities();
  }, []);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.roomNumber.trim()) e.roomNumber = "Room number is required.";
    if (!form.price || isNaN(Number(form.price))) e.price = "Valid price is required.";
    if (!form.capacity || isNaN(Number(form.capacity))) e.capacity = "Valid capacity is required.";
    if (selectedFacilities.length === 0) e.facilities = "At least one facility is required.";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    if (images.length === 0) { toast.warning("Please upload at least one room image."); return; }

    setIsSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("roomNumber", form.roomNumber);
      fd.append("price", form.price);
      fd.append("capacity", form.capacity);
      fd.append("discount", form.discount || "0");
      selectedFacilities.forEach((f) => fd.append("facilities", f._id));
      images.forEach((img) => fd.append("imgs", img));

      await axiosClient.post("admin/rooms", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Room created successfully!");
      navigate("/dashboard/rooms");
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.message || "Failed to create room."
        : "Something went wrong.";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // ✅ Centered layout: flexbox centers the card both horizontally and vertically
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f9fafb",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        px: { xs: 2, sm: 3 },
        py: { xs: 3, sm: 5 },
      }}
    >
      {/* Header — aligned to card width */}
      <Box sx={{ width: "100%", maxWidth: 720, mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <IconButton
            onClick={() => navigate("/dashboard/rooms")}
            sx={{ bgcolor: "#fff", border: "1px solid #e5e7eb", borderRadius: 2, "&:hover": { bgcolor: "#f3f4f6" } }}
          >
            <ArrowBackIcon fontSize="small" />
          </IconButton>
          <Box>
            <Typography variant="h6"  color="text.primary" sx={{fontWeight:700}}>
              Add New Room
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center" }}>
              Fill in the details to create a new room
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Form Card */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: "1px solid #f3f4f6",
          p: { xs: 2.5, sm: 4 },
          width: "100%",
          maxWidth: 720,
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>

          {/* Room Number */}
          <TextField
            label="Room Number"
            placeholder="e.g. 101"
            fullWidth
            size="small"
            value={form.roomNumber}
            onChange={(e) => { setForm((p) => ({ ...p, roomNumber: e.target.value })); setErrors((p) => ({ ...p, roomNumber: "" })); }}
            error={!!errors.roomNumber}
            helperText={errors.roomNumber}
            sx={inputSx}
          />

          {/* Price + Capacity */}
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
             
              <TextField
                label="Price"
                placeholder="e.g. 500"
                fullWidth
                size="small"
                type="number"
                value={form.price}
                onChange={(e) => { setForm((p) => ({ ...p, price: e.target.value })); setErrors((p) => ({ ...p, price: "" })); }}
                error={!!errors.price}
                helperText={errors.price}
                slotProps={{
                  input: { startAdornment: <InputAdornment position="start">$</InputAdornment> },
                }}
                sx={inputSx}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Capacity"
                placeholder="e.g. 2"
                fullWidth
                size="small"
                type="number"
                value={form.capacity}
                onChange={(e) => { setForm((p) => ({ ...p, capacity: e.target.value })); setErrors((p) => ({ ...p, capacity: "" })); }}
                error={!!errors.capacity}
                helperText={errors.capacity}
                sx={inputSx}
              />
            </Grid>
          </Grid>

          {/* Discount */}
          <TextField
            label="Discount (%)"
            placeholder="e.g. 10"
            fullWidth
            size="small"
            type="number"
            value={form.discount}
            onChange={(e) => setForm((p) => ({ ...p, discount: e.target.value }))}
            slotProps={{
              input: { endAdornment: <InputAdornment position="end">%</InputAdornment> },
            }}
            sx={inputSx}
          />

          {/* Facilities */}
          {/* ✅ Fix 3: type renderTags params explicitly so TS is happy */}
         <Autocomplete<Facility, true, false, false>
            multiple
            options={facilities}
            getOptionLabel={(option) => option.name}
            value={selectedFacilities}
            onChange={(_, newValue) => {
              setSelectedFacilities(newValue);
              setErrors((p) => ({ ...p, facilities: "" }));
            }}
            loading={loadingFacilities}
            isOptionEqualToValue={(option, value) =>
              option._id === value._id
            }
            renderValue={(selected) =>
              selected.map((option) => (
                <Chip
                  key={option._id}
                  label={option.name}
                  size="small"
                  sx={{
                    bgcolor: "#eff6ff",
                    color: "#2563eb",
                    border: "1px solid #bfdbfe",
                    fontSize: 12,
                    mr: 0.5,
                  }}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Facilities"
                placeholder={
                  selectedFacilities.length === 0
                    ? "Select facilities..."
                    : ""
                }
                size="small"
                error={!!errors.facilities}
                helperText={errors.facilities}
                sx={inputSx}
              />
            )}
          />
          {/* Image Upload */}
          <Box>
            {/* ✅ Fix 1 (label): plain span via Box instead of nested Typography */}
            <Typography variant="body2" sx={{ fontWeight: 600, color: "text.secondary", mb: 1 }}>
              Room Images{" "}
              <Box component="span" sx={{ color: "error.main" }}>*</Box>
            </Typography>
            <ImageUploadZone files={images} onChange={setImages} />
          </Box>

          {/* Actions */}
          <Box sx={{ display: "flex", gap: 2, pt: 1 }}>
            <Button
              onClick={() => navigate("/dashboard/rooms")}
              fullWidth
              variant="outlined"
              sx={{ borderRadius: 2, textTransform: "none", borderColor: "#e5e7eb", color: "text.secondary", fontWeight: 600 }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              fullWidth
              variant="contained"
              disabled={isSubmitting}
              sx={{ borderRadius: 2, textTransform: "none", bgcolor: "#2563eb", "&:hover": { bgcolor: "#1d4ed8" }, fontWeight: 600 }}
              startIcon={isSubmitting ? <CircularProgress size={14} color="inherit" /> : null}
            >
              {isSubmitting ? "Creating…" : "Create Room"}
            </Button>
          </Box>

        </Box>
      </Paper>
    </Box>
  );
};

export default AddRoom;