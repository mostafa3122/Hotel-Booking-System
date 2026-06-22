import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import axiosClient from "../services/api/axiosClient";
import { AuthContext } from "./AuthContext";

interface FavoritesContextType {
  favoriteCount: number;
  incrementFavoriteCount: () => void;
  decrementFavoriteCount: () => void;
  refreshFavoriteCount: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { token } = useContext(AuthContext);
  const [favoriteCount, setFavoriteCount] = useState(0);

  // Pulls the real count from the server — used on login and whenever we
  // want to make sure the badge matches reality (e.g. after visiting the
  // favorites page).
  const refreshFavoriteCount = useCallback(async () => {
    if (!token) {
      setFavoriteCount(0);
      return;
    }
    try {
      const res = await axiosClient.get("/portal/favorite-rooms");
      const rooms = res?.data?.data?.favoriteRooms?.[0]?.rooms || [];
      setFavoriteCount(rooms.length);
    } catch {
      // Stay quiet — worst case the badge is briefly stale, not worth a toast.
    }
  }, [token]);

  // Re-sync whenever auth state changes (login fetches the real count,
  // logout resets it to 0).
  useEffect(() => {
    refreshFavoriteCount();
  }, [refreshFavoriteCount]);

  const incrementFavoriteCount = () => setFavoriteCount((prev) => prev + 1);
  const decrementFavoriteCount = () => setFavoriteCount((prev) => Math.max(0, prev - 1));

  return (
    <FavoritesContext.Provider
      value={{ favoriteCount, incrementFavoriteCount, decrementFavoriteCount, refreshFavoriteCount }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return ctx;
}