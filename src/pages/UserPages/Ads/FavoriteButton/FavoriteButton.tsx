import IconButton from "@mui/material/IconButton";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import axiosClient from "../../../../services/api/axiosClient";
import React from "react";

type Props = {
  roomId: string;
  isAuthenticated: boolean;
  onSuccess?: (msg: string) => void;
  onError?: (msg: string) => void;
};

export default function FavoriteButton({
  roomId,
  isAuthenticated,
  onSuccess,
  onError,
}: Props) {
  const handleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      onError?.("You must login first to add favorites");
      return;
    }

    try {
      await axiosClient.post("/portal/favorite-rooms", {
        roomId,
      });

      onSuccess?.("Added to favorites ❤️");
    } catch (error: unknown) {
      let msg = "Failed to add favorite";

      if (error && typeof error === "object") {
        const err = error as any;
        msg = err?.response?.data?.message || msg;
      }

      // handle duplicate favorite gracefully
      if (msg.includes("already in your favorite")) {
        onError?.("Already in favorites ❤️");
        return;
      }

      onError?.(msg);
    }
  };

  return (
    <IconButton
      onClick={handleFavorite}
      sx={{
        bgcolor: "rgba(255,255,255,0.2)",
        color: "#fff",
        transition: "0.3s",
        "&:hover": {
          bgcolor: "rgba(255,255,255,0.35)",
        },
      }}
    >
      <FavoriteBorderIcon />
    </IconButton>
  );
}