import React, { useEffect, useState } from "react";
import axios from "axios";
import axiosClient from "../../../services/api/axiosClient";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// MUI
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Skeleton from "@mui/material/Skeleton";
import Pagination from "@mui/material/Pagination";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import InputAdornment from "@mui/material/InputAdornment";

// Icons
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";

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

// ── Action Menu ───────────────────────────────────────────────────────────────
function RoomActionMenu({
  room,
  onView,
  onEdit,
  onDelete,
}: {
  room: Room;
  onView: (r: Room) => void;
  onEdit: (r: Room) => void;
  onDelete: (r: Room) => void;
}) {
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);
  return (
    <>
      <IconButton size="small" onClick={(e) => setAnchor(e.currentTarget)}>
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        PaperProps={{ sx: { borderRadius: 2, minWidth: 140, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" } }}
      >
        <MenuItem onClick={() => { setAnchor(null); onView(room); }}>
          <ListItemIcon><VisibilityIcon fontSize="small" sx={{ color: "#3b82f6" }} /></ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: 14 }}>View</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { setAnchor(null); onEdit(room); }}>
          <ListItemIcon><EditIcon fontSize="small" sx={{ color: "#f59e0b" }} /></ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: 14 }}>Edit</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => { setAnchor(null); onDelete(room); }}>
          <ListItemIcon><DeleteIcon fontSize="small" sx={{ color: "#ef4444" }} /></ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: 14, color: "#ef4444" }}>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}

// ── Delete Confirmation Dialog ────────────────────────────────────────────────
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
      PaperProps={{ sx: { borderRadius: 3, maxWidth: 400, width: "100%" } }}
    >
      <DialogTitle sx={{ textAlign: "center", pt: 4, pb: 1 }}>
        <Box sx={{ width: 52, height: 52, borderRadius: "50%", bgcolor: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 2 }}>
          <DeleteIcon sx={{ color: "#ef4444" }} />
        </Box>
        <Typography fontWeight={700} fontSize={18}>Delete Room</Typography>
      </DialogTitle>
      <DialogContent sx={{ textAlign: "center", color: "text.secondary", fontSize: 14, pb: 1 }}>
        Are you sure you want to delete <strong>Room {room?.roomNumber}</strong>? This action cannot be undone.
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

// ── Main Rooms Component ──────────────────────────────────────────────────────
const Rooms = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Room | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  // Fetch
  const fetchRooms = async (p = 1) => {
    setLoading(true);
    try {
      const response = await axiosClient.get("admin/rooms", {
        params: { page: p, size: PAGE_SIZE },
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

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, minHeight: "100vh", bgcolor: "#f9fafb" }}>

      {/* Header */}
      <Box sx={{
        display: "flex",
        alignItems: { sm: "center" },
        justifyContent: "space-between",
        flexDirection: { xs: "column", sm: "row" },
        gap: 2,
        mb: 3,
      }}>
        <Box>
          <Typography variant="h6" fontWeight={700} color="text.primary">
            Rooms Table Details
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You can check all details
          </Typography>
        </Box>

        {/* ✅ Navigates to /dashboard/rooms/add instead of opening a dialog */}
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
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" sx={{ color: "text.disabled" }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Table */}
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{ borderRadius: 3, border: "1px solid #f3f4f6" }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#f9fafb" }}>
              {["Room Number", "Image", "Price", "Discount", "Capacity", "Facilities", ""].map((h) => (
                <TableCell
                  key={h}
                  sx={{ fontSize: 12, fontWeight: 700, color: "text.disabled", textTransform: "uppercase", letterSpacing: "0.04em", borderBottom: "1px solid #f3f4f6", whiteSpace: "nowrap" }}
                >
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {loading
              ? Array.from({ length: 7 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 7 }).map((__, j) => (
                    <TableCell key={j} sx={{ borderBottom: "1px solid #f9fafb" }}>
                      <Skeleton variant="rounded" height={16} width={j === 1 ? 48 : j === 0 ? 60 : 50} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
              : filtered.length === 0
              ? (
                <TableRow>
                  <TableCell colSpan={7} sx={{ textAlign: "center", py: 8, color: "text.disabled", fontSize: 14 }}>
                    No rooms found.
                  </TableCell>
                </TableRow>
              )
              : filtered.map((room) => (
                <TableRow
                  key={room._id}
                  hover
                  sx={{ "&:hover": { bgcolor: "#eff6ff" }, "& td": { borderBottom: "1px solid #f9fafb" } }}
                >
                  {/* Room Number */}
                  <TableCell sx={{ fontWeight: 600, color: "text.primary", fontSize: 14 }}>
                    {room.roomNumber}
                  </TableCell>

                  {/* Image */}
                  <TableCell>
                    {room.images?.[0] ? (
                      <Box
                        component="img"
                        src={room.images[0]}
                        alt={`Room ${room.roomNumber}`}
                        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                          e.currentTarget.src = "https://placehold.co/48x40?text=Room";
                        }}
                        sx={{ width: 52, height: 42, borderRadius: 1.5, objectFit: "cover", border: "1px solid #f3f4f6", display: "block" }}
                      />
                    ) : (
                      <Box sx={{ width: 52, height: 42, borderRadius: 1.5, bgcolor: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Typography fontSize={10} color="text.disabled">No img</Typography>
                      </Box>
                    )}
                  </TableCell>

                  {/* Price */}
                  <TableCell sx={{ fontWeight: 600, color: "text.primary", fontSize: 14 }}>
                    ${room.price}
                  </TableCell>

                  {/* Discount */}
                  <TableCell>
                    {room.discount > 0 ? (
                      <Chip
                        label={`-${room.discount}%`}
                        size="small"
                        sx={{ bgcolor: "#dcfce7", color: "#16a34a", fontWeight: 600, fontSize: 11, height: 22, border: "1px solid #bbf7d0" }}
                      />
                    ) : (
                      <Typography color="text.disabled" fontSize={14}>—</Typography>
                    )}
                  </TableCell>

                  {/* Capacity */}
                  <TableCell sx={{ color: "text.secondary", fontSize: 14 }}>
                    {room.capacity}
                  </TableCell>

                  {/* Facilities */}
                  <TableCell>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, maxWidth: 180 }}>
                      {room.facilities?.length > 0 ? (
                        room.facilities.map((f) => (
                          <Chip
                            key={f._id}
                            label={f.name}
                            size="small"
                            sx={{ bgcolor: "#eff6ff", color: "#2563eb", fontSize: 11, height: 22, border: "1px solid #bfdbfe" }}
                          />
                        ))
                      ) : (
                        <Typography color="text.disabled" fontSize={13}>—</Typography>
                      )}
                    </Box>
                  </TableCell>

                  {/* Actions */}
                  <TableCell align="right">
                    <RoomActionMenu
                      room={room}
                      onView={(r) => navigate(`/dashboard/rooms/${r._id}`)}
                      onEdit={(r) => navigate(`/dashboard/rooms/edit/${r._id}`)}
                      onDelete={(r) => setDeleteTarget(r)}
                    />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 3, flexWrap: "wrap", gap: 1 }}>
          <Typography fontSize={13} color="text.secondary">
            Page <strong>{page}</strong> of <strong>{totalPages}</strong> ({totalCount} rooms)
          </Typography>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, v) => setPage(v)}
            shape="rounded"
            size="small"
            sx={{
              "& .MuiPaginationItem-root": { borderRadius: 1.5 },
              "& .Mui-selected": { bgcolor: "#2563eb !important", color: "#fff" },
            }}
          />
        </Box>
      )}

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