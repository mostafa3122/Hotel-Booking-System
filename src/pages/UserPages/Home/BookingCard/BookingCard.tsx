import { useCallback, useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";

import { Box, Typography, IconButton } from "@mui/material";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import CustomButton from "../../../../shared/components/CustomButton/CustomButton";
import { useNavigate } from "react-router-dom";
import axiosClient from "./../../../../services/api/axiosClient";

export default function BookingCard() {
  const navigate = useNavigate();

  const [capacity, setCapacity] = useState(2);

  const [checkIn, setCheckIn] = useState<Dayjs | null>(dayjs("2026-01-20"));

  const [checkOut, setCheckOut] = useState<Dayjs | null>(dayjs("2026-01-22"));

  const increaseCapacity = () => {
    setCapacity((prev) => prev + 1);
  };

  const decreaseCapacity = () => {
    if (capacity > 1) {
      setCapacity((prev) => prev - 1);
    }
  };
  // all rooms

const getAll = useCallback(async () => {
  try {
    const response = await axiosClient.get(
      "/portal/rooms/available",
      {
        params: {
          page: 1,
          size: 10,
          startDate: checkIn?.format("YYYY-MM-DD"),
          endDate: checkOut?.format("YYYY-MM-DD"),
        },
      }
    );

    console.log(response?.data?.data?.rooms);
  } catch (error) {
    console.log(error);
  }
}, [checkIn, checkOut]);

useEffect(() => {
  getAll();
}, [getAll]);
  const handleExplore = () => {
    const query = new URLSearchParams({
      checkIn: checkIn?.format("YYYY-MM-DD") || "",
      checkOut: checkOut?.format("YYYY-MM-DD") || "",
      capacity: String(capacity),
    });

    navigate(`/explore?${query.toString()}`);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {/* Title */}
      <Typography variant="h5" sx={{ fontWeight: 700, color: "#152c5b" }}>
        Start Booking
      </Typography>

      {/* DATE SECTION */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Typography sx={{ fontWeight: 600, color: "#152c5b" }}>
          Pick a Date
        </Typography>

        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          {/* Icon */}
          <Box
            sx={{
              bgcolor: "#152c5b",
              color: "#fff",
              width: 56,
              height: 56,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 2,
            }}
          >
            <CalendarMonthIcon />
          </Box>

          {/* Check In */}
          <DatePicker
            label="Check In"
            value={checkIn}
            onChange={(newValue) => setCheckIn(newValue)}
            slotProps={{
              textField: { size: "small" },
            }}
          />

          {/* Check Out */}
          <DatePicker
            label="Check Out"
            value={checkOut}
            onChange={(newValue) => setCheckOut(newValue)}
            slotProps={{
              textField: { size: "small" },
            }}
          />
        </Box>
      </Box>

      {/* CAPACITY */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Typography sx={{ fontWeight: 600, color: "#152c5b" }}>
          Capacity
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            bgcolor: "#f8f9fb",
            width:"86%",
            borderRadius: 2,
            border: "1px solid #eee",
            overflow: "hidden",
          }}
        >
          {/* Minus */}
          <IconButton
            onClick={decreaseCapacity}
            sx={{
              width: 80,
              height: 60,
              borderRadius: 0,
              bgcolor: "#E74C3C",
              color: "#fff",
              "&:hover": { bgcolor: "#C0392B" },
            }}
          >
            <RemoveIcon />
          </IconButton>

          {/* Value */}
          <Typography
            sx={{
              flex: 1,
              textAlign: "center",
              fontSize: 18,
              fontWeight: 600,
              color: "#152c5b",
            }}
          >
            {capacity} Person
          </Typography>

          {/* Plus */}
          <IconButton
            onClick={increaseCapacity}
            sx={{
              width: 80,
              height: 60,
              borderRadius: 0,
              bgcolor: "#27AE60",
              color: "#fff",
              "&:hover": { bgcolor: "#1E8449" },
            }}
          >
            <AddIcon />
          </IconButton>
        </Box>
      </Box>

    
      {/* Explore Button */}
      <CustomButton
        text="Explore Now"
        onClick={handleExplore}
        variant="primary"
        size="large"
      />
    </LocalizationProvider>
  );
}
