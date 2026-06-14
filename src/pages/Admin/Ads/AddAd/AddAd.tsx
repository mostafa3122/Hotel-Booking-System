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
  FormHelperText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
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

interface FormValues {
  roomId: string;
  discount: number | "";
  isActive: boolean;
}

export default function AddAd({
  open,
  onClose,
  onSuccess,
  adData,
}: AddAdProps) {
  const isEdit = !!adData;

  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [roomsLoading, setRoomsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      roomId: "",
      discount: "",
      isActive: true,
    },
  });

  const getRoomNumber = (id: string) => {
    return rooms.find((r) => r._id === id)?.roomNumber || id;
  };

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

  useEffect(() => {
    if (open) {
      console.log("adData:", adData);
      fetchRooms();
      if (isEdit && adData) {
        reset({
          roomId: adData.room._id,
          discount: adData.discount,
          isActive: adData.isActive,
        });
      } else {
        reset({
          roomId: "",
          discount: "",
          isActive: true,
        });
      }
    }
  }, [open, adData, isEdit, reset]);

  const handleClose = () => {
    reset({ roomId: "", discount: "", isActive: true });
    onClose();
  };

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);
      if (isEdit && adData) {
        await axiosClient.put(`/admin/ads/${adData._id}`, {
          isActive: data.isActive,
          discount: Number(data.discount),
        });
        toast.success("Ad updated successfully");
      } else {
        await axiosClient.post("/admin/ads", {
          room: data.roomId,
          isActive: data.isActive,
          discount: Number(data.discount),
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
      toast.error(
        formattedMessage ||
          (isEdit ? "Failed to update ad" : "Failed to add ad")
      );
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
        {/* Room Select */}
        <Controller
          name="roomId"
          control={control}
          rules={{ required: isEdit ? false : "Please select a room" }}
          render={({ field }) => (
            <FormControl fullWidth error={!!errors.roomId}>
              <InputLabel>Room Name</InputLabel>
              <Select
                {...field}
                label="Room Name"
                disabled={roomsLoading || isEdit}
                endAdornment={
                  roomsLoading ? (
                    <CircularProgress size={16} sx={{ mr: 2 }} />
                  ) : null
                }
              >
                {isEdit &&
                  adData &&
                  !rooms.find((r) => r._id === adData.room._id) && (
                    <MenuItem value={adData.room._id}>
                      {adData.room.roomNumber}
                    </MenuItem>
                  )}
                {rooms.map((room) => (
                  <MenuItem key={room._id} value={room._id}>
                    {room.roomNumber}
                  </MenuItem>
                ))}
              </Select>
              {errors.roomId && (
                <FormHelperText>{errors.roomId.message}</FormHelperText>
              )}
            </FormControl>
          )}
        />

        {/* Discount */}
        <TextField
          label="Discount"
          type="number"
          fullWidth
          error={!!errors.discount}
          helperText={errors.discount?.message}
          {...register("discount", {
            required: "Please enter a discount",
            min: { value: 0, message: "Discount can't be less than 0" },
            max: { value: 100, message: "Discount can't exceed 100" },
            valueAsNumber: true,
          })}
          slotProps={{ htmlInput: { min: 0, max: 100 } }}
        />

        {/* Active */}
        <Controller
          name="isActive"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                label="Active"
                value={field.value ? "true" : "false"}
                onChange={(e) => field.onChange(e.target.value === "true")}
              >
                <MenuItem value="true">Active</MenuItem>
                <MenuItem value="false">Inactive</MenuItem>
              </Select>
            </FormControl>
          )}
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, justifyContent: "flex-end" }}>
        <Button
          onClick={handleSubmit(onSubmit)}
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
