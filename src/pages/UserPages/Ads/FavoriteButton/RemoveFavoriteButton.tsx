import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useState } from "react";
import axiosClient from "../../../../services/api/axiosClient";

type Props = {
  roomId: string;
  onSuccess?: (msg: string) => void;
  onError?: (msg: string) => void;
};

export default function RemoveFavoriteButton({
  roomId,
  onSuccess,
  onError,
}: Props) {
  const [loading, setLoading] = useState(false);

  const handleRemove = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (loading) return;

    try {
      setLoading(true);

      await axiosClient.delete(`/portal/favorite-rooms/${roomId}`, {
        data: { roomId },
      });

      onSuccess?.("Removed from favorites");
    } catch (error: unknown) {
      let msg = "Failed to remove favorite";

      if (error && typeof error === "object") {
        const err = error as any;
        msg = err?.response?.data?.message || msg;
      }

      onError?.(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <IconButton
      onClick={handleRemove}
      disabled={loading}
      sx={{
        bgcolor: "rgba(255,255,255,0.2)",
        color: "#FF498B",
        transition: "0.3s",
        "&:hover": {
          bgcolor: "rgba(255,255,255,0.35)",
        },
      }}
    >
      <FavoriteIcon />
    </IconButton>
  );
}
