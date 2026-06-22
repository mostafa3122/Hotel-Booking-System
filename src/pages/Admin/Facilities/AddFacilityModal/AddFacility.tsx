import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
  TextField,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axiosClient from "../../../../services/api/axiosClient";

type FacilityFormData = {
  name: string;
};

type Facility = {
  _id: string;
  name: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  facility?: Facility | null;
};

export default function AddFacilityModal({
  open,
  onClose,
  onSuccess,
  facility,
}: Props) {
  const isEdit = !!facility;

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FacilityFormData>({
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (open) {
      if (isEdit && facility) {
        reset({ name: facility.name });
      } else {
        reset({ name: "" });
      }
    }
  }, [open, facility, isEdit, reset]);

  const handleClose = () => {
    reset({ name: "" });
    onClose();
  };

 const onSubmit = async (data: FacilityFormData) => {
  try {
    setLoading(true);

    let res;

    if (isEdit && facility) {
      res = await axiosClient.put(
        `/admin/room-facilities/${facility._id}`,
        {
          name: data.name,
        }
      );

      toast.success(res.data?.message || "Facility updated successfully");
    } else {
      res = await axiosClient.post("/admin/room-facilities", {
        name: data.name,
      });

      toast.success(res.data?.message || "Facility created successfully");
    }

    onSuccess();
    handleClose();
  } catch (error: any) {
    toast.error(
      error?.response?.data?.message || "Something went wrong"
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
      {/* Header */}
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
          {isEdit ? "Edit Facility" : "Add Facility"}
        </DialogTitle>

        <IconButton
          onClick={handleClose}
          color="error"
          sx={{ border: "2px solid", width: 32, height: 32 }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Content */}
      <DialogContent sx={{ px: 3, pt: 2 }}>
          <TextField
  fullWidth
  label="Facility Name"
  margin="normal"
  {...register("name", {
    required: "Facility Name is required",
  })}
  sx={{
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#203fc7",
      },
      "&:hover fieldset": {
        borderColor: "#203fc7",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#203fc7",
      },
    },

    "& .MuiInputBase-input": {
      color: "#203fc7",
    },

    "& .MuiInputLabel-root.Mui-focused": {
      color: "#203fc7",
    },
  }}
/>
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleClose} variant="outlined" color="inherit">
          Cancel
        </Button>

        <Button
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          disabled={loading}
          sx={{
            textTransform: "none",
            minWidth: 100,
            backgroundColor: "#203FC7",
            "&:hover": { backgroundColor: "#1a33a3" },
          }}
        >
          {loading ? (
            <CircularProgress size={18} color="inherit" />
          ) : isEdit ? (
            "Update"
          ) : (
            "Save"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}