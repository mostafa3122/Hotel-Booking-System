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
  const { token, role } = useContext(AuthContext);
  const [favoriteCount, setFavoriteCount] = useState(0);

  // Only regular (non-admin) logged-in users have access to portal endpoints.
  // Admins get a 401 from /portal/favorite-rooms because their token is scoped
  // to admin endpoints only — so we skip the fetch entirely for them.
  const isRegularUser = !!token && role !== "admin";

  const refreshFavoriteCount = useCallback(async () => {
    if (!isRegularUser) {
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
  }, [isRegularUser]);

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