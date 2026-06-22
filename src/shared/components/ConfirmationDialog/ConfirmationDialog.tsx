import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  IconButton,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import  DeleteIMG  from "../../../assets/deleteImg.png";
import { t } from "i18next";
interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
  title?: string;
  message?: string;
  image?: string;
  confirmText?: string;
  loadingText?: string;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  onClose,
  onConfirm,
  loading = false,
  title = "Delete Confirmation",
  message = "Are you sure you want to delete this item?",
  image = DeleteIMG,
  confirmText = "Delete",
  loadingText = "Deleting...",
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      slotProps={{
        paper: {
          sx: {
            borderRadius: 2,
            maxWidth: 500,
          },
        },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
        <IconButton
          onClick={onClose}
          color="error"
          sx={{ border: "2px solid", width: 30, height: 30 }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
      <Box sx={{ textAlign: "center", px: 3 }}>
        <img
          src={image}
          alt={title}
          style={{ width: 100, height: 100, objectFit: "contain" }}
        />

        <DialogTitle sx={{ fontWeight: 700, fontSize: 20, p: 0, mt: 2 }}>
          {title}
        </DialogTitle>

        <DialogContent sx={{ p: 0, mt: 1 }}>
          <DialogContentText sx={{ fontSize: 14, color: "text.secondary" }}>
            {message}
          </DialogContentText>
        </DialogContent>
      </Box>
      <DialogActions sx={{ justifyContent: "center", pb: 3, gap: 2 }}>
        <Button onClick={onClose} variant="outlined" color="inherit">
          {t("cancel")}
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          disabled={loading}
          sx={{ textTransform: "none", minWidth: 90 }}
        >
          {loading ? loadingText : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
