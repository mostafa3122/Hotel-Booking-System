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

import Chip from "@mui/material/Chip";
import InputAdornment from "@mui/material/InputAdornment";

// Icons
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";


// Shared table

import ConfirmationDialog from "../../../shared/components/ConfirmationDialog/ConfirmationDialog";
import CustomTable from "../../../shared/components/CustomTable/CustomTable";

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

// ── Constants ─────────────────────────────────────────────────────────────────
const PAGE_SIZE = 10;

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
          // ✅ slotProps instead of InputProps (MUI v6)
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

      {/* ✅ CustomTable replaces the hand-rolled Table + pagination */}
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
      <ConfirmationDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={isDeleting}
        title="Delete Room"
        message={`Are you sure you want to delete Room ${deleteTarget?.roomNumber}? This action cannot be undone.`}
        confirmText="Delete"
        loadingText="Deleting…"
      />
    </Box>
  );
};

export default Rooms;