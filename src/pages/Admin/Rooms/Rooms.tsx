import React, { useEffect, useState } from "react";
import axios from "axios";
import axiosClient from "../../../services/api/axiosClient";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import type { GridColDef } from "@mui/x-data-grid";

// MUI
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import InputAdornment from "@mui/material/InputAdornment";


import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomTable from "../../../shared/components/CustomTable/CustomTable";

// Shared table


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


const PAGE_SIZE = 10;


const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    backgroundColor: "#f9fafb",
    "& fieldset": { borderColor: "#e5e7eb" },
    "&:hover fieldset": { borderColor: "#3b82f6" },
    "&.Mui-focused fieldset": { borderColor: "#2563eb" },
  },
};


function DeleteDialog({
  room,
  open,
  onClose,
  onConfirm,
  isDeleting,
}: {
  room: Room | null;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      
      slotProps={{ paper: { sx: { borderRadius: 3, maxWidth: 400, width: "100%" } } }}
    >
      <DialogTitle sx={{ textAlign: "center", pt: 4, pb: 1 }}>
        <Box
          sx={{
            width: 52, height: 52, borderRadius: "50%", bgcolor: "#fee2e2",
            display: "flex", alignItems: "center", justifyContent: "center",
            mx: "auto", mb: 2,
          }}
        >
          <DeleteIcon sx={{ color: "#ef4444" }} />
        </Box>
        {/* ✅ fontSize via sx, not as a direct prop */}
        <Typography variant="h6" color="text.primary" sx={{ fontWeight: 600 }}>
          Delete Room
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ textAlign: "center", color: "text.secondary", pb: 1 }}>
        <Typography variant="body2">
          Are you sure you want to delete{" "}
          <Box component="strong">Room {room?.roomNumber}</Box>? This action cannot be undone.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, gap: 1.5 }}>
        <Button
          onClick={onClose}
          fullWidth
          variant="outlined"
          sx={{ borderRadius: 2, textTransform: "none", borderColor: "#e5e7eb", color: "text.secondary" }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          fullWidth
          variant="contained"
          disabled={isDeleting}
          sx={{ borderRadius: 2, textTransform: "none", bgcolor: "#ef4444", "&:hover": { bgcolor: "#dc2626" } }}
          startIcon={isDeleting ? <CircularProgress size={14} color="inherit" /> : null}
        >
          {isDeleting ? "Deleting…" : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ── Column definitions ────────────────────────────────────────────────────────
function buildColumns(): GridColDef[] {
  return [
    {
      field: "roomNumber",
      headerName: "Room Number",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <Typography sx={{ fontWeight: 600, fontSize: 14, color: "text.primary" }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: "images",
      headerName: "Image",
      width: 90,
      sortable: false,
      renderCell: (params) => {
        const src: string | undefined = params.value?.[0];
        return src ? (
          <Box
            component="img"
            src={src}
            alt="room"
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
              e.currentTarget.src = "https://placehold.co/52x42?text=Room";
            }}
            sx={{ width: 52, height: 42, borderRadius: 1.5, objectFit: "cover", border: "1px solid #f3f4f6" }}
          />
        ) : (
          <Box
            sx={{
              width: 52, height: 42, borderRadius: 1.5, bgcolor: "#f3f4f6",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <Typography sx={{ fontSize: 10, color: "text.disabled" }}>No img</Typography>
          </Box>
        );
      },
    },
    {
      field: "price",
      headerName: "Price",
      width: 100,
      renderCell: (params) => (
        <Typography sx={{ fontWeight: 600, fontSize: 14, color: "text.primary" }}>
          ${params.value}
        </Typography>
      ),
    },
    {
      field: "discount",
      headerName: "Discount",
      width: 100,
      renderCell: (params) =>
        params.value > 0 ? (
          <Chip
            label={`-${params.value}%`}
            size="small"
            sx={{ bgcolor: "#dcfce7", color: "#16a34a", fontWeight: 600, fontSize: 11, height: 22, border: "1px solid #bbf7d0" }}
          />
        ) : (
          <Typography sx={{ color: "text.disabled", fontSize: 14 }}>—</Typography>
        ),
    },
    {
      field: "capacity",
      headerName: "Capacity",
      width: 100,
      renderCell: (params) => (
        <Typography sx={{ color: "text.secondary", fontSize: 14 }}>{params.value}</Typography>
      ),
    },
    {
      field: "facilities",
      headerName: "Facilities",
      flex: 1,
      minWidth: 160,
      sortable: false,
      renderCell: (params) => {
        const list: Facility[] = params.value ?? [];
        return list.length > 0 ? (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {list.map((f) => (
              <Chip
                key={f._id}
                label={f.name}
                size="small"
                sx={{ bgcolor: "#eff6ff", color: "#2563eb", fontSize: 11, height: 22, border: "1px solid #bfdbfe" }}
              />
            ))}
          </Box>
        ) : (
          <Typography sx={{ color: "text.disabled", fontSize: 13 }}>—</Typography>
        );
      },
    },
  ];
}

// ── Main Rooms Component ──────────────────────────────────────────────────────
const Rooms = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0); // DataGrid is 0-indexed
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Room | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch
  const fetchRooms = async (p = 0) => {
    setLoading(true);
    try {
      const response = await axiosClient.get("admin/rooms", {
        params: { page: p + 1, size: PAGE_SIZE }, // API is 1-indexed
      });
      const payload = response.data?.data;
      setRooms(payload?.rooms ?? []);
      setTotalCount(payload?.totalCount ?? payload?.rooms?.length ?? 0);
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.message || `Error ${err.response?.status}`
        : "Failed to load rooms.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRooms(page); }, [page]);

  // Delete
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await axiosClient.delete(`admin/rooms/${deleteTarget._id}`);
      toast.success(`Room ${deleteTarget.roomNumber} deleted.`);
      setDeleteTarget(null);
      fetchRooms(page);
    } catch {
      toast.error("Failed to delete room.");
    } finally {
      setIsDeleting(false);
    }
  };

  const filtered = rooms.filter((r) =>
    r.roomNumber.toLowerCase().includes(search.toLowerCase())
  );

  const columns = buildColumns();

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, minHeight: "100vh", bgcolor: "#f9fafb" }}>

      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: { sm: "center" },
          justifyContent: "space-between",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h6" color="text.primary" sx={{ fontWeight: 600 }}>
            Rooms Table Details
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You can check all details
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/dashboard/rooms/add")}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            bgcolor: "#2563eb",
            "&:hover": { bgcolor: "#1d4ed8" },
            px: 2.5,
            alignSelf: { xs: "flex-start", sm: "auto" },
          }}
        >
          Add New Room
        </Button>
      </Box>

      {/* Search */}
      <Box sx={{ mb: 3 }}>
        <TextField
          placeholder="Search by number …"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ ...inputSx, maxWidth: 340, width: "100%" }}
          
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: "text.disabled" }} />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

     
      <CustomTable
        rows={filtered}
        columns={columns}
        loading={loading}
        rowCount={totalCount}
        paginationMode="server"
        paginationModel={{ page, pageSize: PAGE_SIZE }}
        onPaginationModelChange={(model) => setPage(model.page)}
        height={600}
        onView={(row: Room) => navigate(`/dashboard/rooms/${row._id}`)}
        onEdit={(row: Room) => navigate(`/dashboard/rooms/${row._id}/edit`)}
        onDelete={(row: Room) => setDeleteTarget(row)}
      />

      {/* Delete Modal */}
      <DeleteDialog
        room={deleteTarget}
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </Box>
  );
};

export default Rooms;