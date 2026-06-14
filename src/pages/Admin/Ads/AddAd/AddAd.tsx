import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TextField,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import axiosClient from "../../../../services/api/axiosClient";
import { toast } from "react-toastify";

interface Room {
  _id: string;
  roomNumber: string;
}

interface Ad {
  _id: string;
  isActive: boolean;
  discount: number;
  room: {
    _id: string;
    roomNumber: string;
  };
}

interface AddAdProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  adData?: Ad | null;
}

export default function AddAd({ open, onClose, onSuccess, adData }: AddAdProps) {
  const isEdit = !!adData;

  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomId, setRoomId] = useState("");
  const [isActive, setIsActive] = useState<boolean>(true);
  const [discount, setDiscount] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [roomsLoading, setRoomsLoading] = useState(false);

  const fetchRooms = async () => {
    try {
      setRoomsLoading(true);
      const response = await axiosClient.get("/admin/rooms");
      setRooms(response.data?.data?.rooms || []);
    } catch {
      toast.error("Failed to load rooms");
    } finally {
      setRoomsLoading(false);
    }
  };

  const getRoomNumber = (id: string) => {
    return rooms.find((r) => r._id === id)?.roomNumber || id;
  };

  useEffect(() => {
    if (open) {
      fetchRooms();
      if (isEdit && adData) {
        setRoomId(adData.room._id);
        setIsActive(adData.isActive);
        setDiscount(adData.discount);
      } else {
        setRoomId("");
        setIsActive(true);
        setDiscount("");
      }
    }
  }, [open]);

  const handleClose = () => {
    setRoomId("");
    setIsActive(true);
    setDiscount("");
    onClose();
  };

  const handleSubmit = async () => {
    if (!isEdit && !roomId) {
      toast.error("Please select a room");
      return;
    }
    if (discount === "") {
      toast.error("Please enter a discount");
      return;
    }
    try {
      setLoading(true);
      if (isEdit) {
        await axiosClient.put(`/admin/ads/${adData._id}`, {
          isActive,
          discount: Number(discount),
        });
        toast.success("Ad updated successfully");
      } else {
        await axiosClient.post("/admin/ads", {
          room: roomId,
          isActive,
          discount: Number(discount),
        });
        toast.success("Ad added successfully");
      }
      onSuccess();
      handleClose();
    } catch (error: any) {
      const message = error.response?.data?.message;
      const formattedMessage = message?.replace(
        /([a-f0-9]{24})/g,
        (match: string) => getRoomNumber(match)
      );
      toast.error(formattedMessage || (isEdit ? "Failed to update ad" : "Failed to add ad"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="xs"
      slotProps={{
        paper: {
          sx: { borderRadius: 3, maxWidth: 420 },
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 3,
          pt: 2,
        }}
      >
        <DialogTitle sx={{ p: 0, fontWeight: 700, fontSize: 20 }}>
          {isEdit ? "Edit Ad" : "Ads"}
        </DialogTitle>
        <IconButton
          onClick={handleClose}
          color="error"
          sx={{ border: "2px solid", width: 32, height: 32 }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <DialogContent
        sx={{ px: 3, pt: 2, display: "flex", flexDirection: "column", gap: 2 }}
      >
        <FormControl fullWidth>
          <InputLabel>Room Name</InputLabel>
          <Select
            value={roomId}
            label="Room Name"
            onChange={(e) => setRoomId(e.target.value)}
            disabled={roomsLoading || isEdit}
            endAdornment={
              roomsLoading ? <CircularProgress size={16} sx={{ mr: 2 }} /> : null
            }
          >
            {rooms.map((room) => (
              <MenuItem key={room._id} value={room._id}>
                {room.roomNumber}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Discount"
          type="number"
          fullWidth
          value={discount}
          onChange={(e) =>
            setDiscount(e.target.value === "" ? "" : Number(e.target.value))
          }
          slotProps={{ htmlInput: { min: 0, max: 100 } }}
        />

        <FormControl fullWidth>
          <InputLabel>Active</InputLabel>
          <Select
            value={isActive ? "true" : "false"}
            label="Active"
            onChange={(e) => setIsActive(e.target.value === "true")}
          >
            <MenuItem value="true">Active</MenuItem>
            <MenuItem value="false">Inactive</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, justifyContent: "flex-end" }}>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            px: 4,
            backgroundColor: "#203FC7",
            "&:hover": { backgroundColor: "#1a33a3" },
          }}
        >
          {loading ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}