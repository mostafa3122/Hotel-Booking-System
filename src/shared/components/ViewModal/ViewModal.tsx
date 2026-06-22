import CloseIcon from "@mui/icons-material/Close";
import {
    Box,
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    Typography,
} from "@mui/material";
import type { ReactNode } from "react";

export interface ViewRow {
  label: string;
  value: ReactNode;
}

interface ViewModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  rows: ViewRow[];
}

export default function ViewModal({
  open,
  onClose,
  title,
  rows,
}: ViewModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: 8,
          },
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          background: "linear-gradient(135deg, #1565C0 0%, #1E88E5 100%)",
          color: "#fff",
          px: 3,
          py: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          sx={{ fontWeight: 700, fontSize: "1.05rem", letterSpacing: "0.3px" }}
        >
          {title}
        </Typography>

        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: "#fff",
            background: "rgba(255,255,255,0.12)",
            transition: "0.2s",
            "&:hover": {
              background: "rgba(255,255,255,0.22)",
              transform: "rotate(90deg)",
            },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ px: 0, py: 1 }}>
        {rows.map((row, i) => (
          <Box key={i}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: 3,
                py: 2,
                gap: 3,
                transition: "0.2s",
                "&:hover": {
                  backgroundColor: "rgba(21,101,192,0.04)",
                },
              }}
            >
              {/* Label */}
              <Typography
                variant="subtitle2"
                sx={{
                  minWidth: 130,
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  color: "primary.main",
                  letterSpacing: "0.2px",
                }}
              >
                {row.label}
              </Typography>

              {/* Value */}
              <Box
                sx={{
                  fontSize: "0.92rem",
                  color: "text.primary",
                  textAlign: "right",
                  wordBreak: "break-word",
                  maxWidth: "70%",
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                {row.value}
              </Box>
            </Box>

            {i < rows.length - 1 && <Divider sx={{ opacity: 0.6, mx: 2 }} />}
          </Box>
        ))}
      </DialogContent>
    </Dialog>
  );
}
