import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../../../services/api/axiosClient";

// ── Types ─────────────────────────────────────────────────────────────────────
export interface Facility {
  _id: string;
  name: string;
}

export interface Room {
  _id: string;
  roomNumber: string;
  price: number;
  discount: number;
  capacity: number;
  facilities: Facility[];
  images: string[];
  createdBy: { _id: string; userName: string };
}

export interface UseRoomDetailsReturn {
  room: Room | null;
  loading: boolean;
  activeImage: number;
  setActiveImage: (index: number) => void;
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useRoomDetails(): UseRoomDetailsReturn {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchRoom = async () => {
      setLoading(true);
      try {
        const res = await axiosClient.get(`admin/rooms/${id}`);
        const payload = res.data?.data;
        setRoom(payload?.room ?? payload);
      } catch (err: unknown) {
        const msg = axios.isAxiosError(err)
          ? err.response?.data?.message || "Failed to load room."
          : "Something went wrong.";
        toast.error(msg);
        navigate("/dashboard/rooms");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchRoom();
  }, [id]);

  return { room, loading, activeImage, setActiveImage };
}