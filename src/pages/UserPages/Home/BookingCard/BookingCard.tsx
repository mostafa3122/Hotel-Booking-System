import { useCallback, useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";

import { Box, Typography, IconButton, Popover } from "@mui/material";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import CustomButton from "../../../../shared/components/CustomButton/CustomButton";
import { useNavigate } from "react-router-dom";
import axiosClient from "./../../../../services/api/axiosClient";

// ── Helpers ───────────────────────────────────────────────────────────────────
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DAY_NAMES = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const formatShort = (d: Dayjs) => d.format("D MMM");

function isSameDay(a: Dayjs, b: Dayjs) {
  return a.isSame(b, "day");
}

// ── Date Range Calendar (same look as RoomData) ───────────────────────────────
function DateRangeCalendar({
  checkIn,
  checkOut,
  onSelect,
}: {
  checkIn: Dayjs | null;
  checkOut: Dayjs | null;
  onSelect: (start: Dayjs | null, end: Dayjs | null) => void;
}) {
  const today = dayjs().startOf("day");
  const [viewMonth, setViewMonth] = useState(checkIn ?? today);

  const year = viewMonth.year();
  const month = viewMonth.month();           // 0-indexed
  const firstOfMonth = dayjs(new Date(year, month, 1));
  const startOffset = firstOfMonth.day();    // 0 = Sunday
  const daysInMonth = viewMonth.daysInMonth();

  const cells: (Dayjs | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) =>
      dayjs(new Date(year, month, i + 1))
    ),
  ];

  const handleDayClick = (day: Dayjs) => {
    if (day.isBefore(today)) return;
    if (!checkIn || (checkIn && checkOut)) {
      onSelect(day, null);
    } else if (day.isSame(checkIn, "day") || day.isBefore(checkIn)) {
      // Clicking check-in date or before restarts selection
      onSelect(day, null);
    } else {
      onSelect(checkIn, day);
    }
  };

  const isInRange = (day: Dayjs) =>
    checkIn && checkOut && day.isAfter(checkIn) && day.isBefore(checkOut);

  return (
    <Box sx={{ p: 2, width: 280 }}>
      {/* Month navigation */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
        <IconButton
          size="small"
          onClick={() => setViewMonth(viewMonth.subtract(1, "month"))}
        >
          <ChevronLeftIcon fontSize="small" />
        </IconButton>
        <Typography sx={{ fontSize: 13.5, fontWeight: 700, color: "#1F1B3C" }}>
          {MONTH_NAMES[month]} {year}
        </Typography>
        <IconButton
          size="small"
          onClick={() => setViewMonth(viewMonth.add(1, "month"))}
        >
          <ChevronRightIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Day-of-week headers */}
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", mb: 0.5 }}>
        {DAY_NAMES.map((d) => (
          <Typography
            key={d}
            sx={{ fontSize: 10.5, color: "#9A97AE", textAlign: "center", fontWeight: 600 }}
          >
            {d}
          </Typography>
        ))}
      </Box>

      {/* Day cells */}
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 0.3 }}>
        {cells.map((day, i) => {
          if (!day) return <Box key={i} />;
          const disabled = day.isBefore(today);
          const selectedStart = checkIn && isSameDay(day, checkIn);
          const selectedEnd = checkOut && isSameDay(day, checkOut);
          const inRange = isInRange(day);
          return (
            <Box
              key={i}
              onClick={() => !disabled && handleDayClick(day)}
              sx={{
                aspectRatio: "1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                borderRadius: 1.2,
                cursor: disabled ? "default" : "pointer",
                color: disabled
                  ? "#D9D7E3"
                  : selectedStart || selectedEnd
                  ? "#fff"
                  : "#1F1B3C",
                bgcolor: selectedStart || selectedEnd
                  ? "#3D2EBF"
                  : inRange
                  ? "#EFEDFB"
                  : "transparent",
                fontWeight: selectedStart || selectedEnd ? 700 : 500,
                "&:hover": !disabled
                  ? {
                      bgcolor:
                        selectedStart || selectedEnd ? "#3D2EBF" : "#F3F1FB",
                    }
                  : {},
              }}
            >
              {day.date()}
            </Box>
          );
        })}
      </Box>

      {/* Helper text */}
      {checkIn && !checkOut && (
        <Typography
          sx={{ fontSize: 11, color: "#9A97AE", textAlign: "center", mt: 1.5 }}
        >
          Now select a check-out date
        </Typography>
      )}
    </Box>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function BookingCard() {
  const navigate = useNavigate();
  const today = dayjs().startOf("day");

  const [capacity, setCapacity] = useState(2);
  const [checkIn, setCheckIn] = useState<Dayjs | null>(today);
  const [checkOut, setCheckOut] = useState<Dayjs | null>(today.add(1, "day"));

  // Popover anchor
  const [dateAnchor, setDateAnchor] = useState<null | HTMLElement>(null);
  const openDatePicker = (e: React.MouseEvent<HTMLElement>) =>
    setDateAnchor(e.currentTarget);
  const closeDatePicker = () => setDateAnchor(null);

  const handleDateSelect = (start: Dayjs | null, end: Dayjs | null) => {
    setCheckIn(start);
    setCheckOut(end);
    if (start && end) closeDatePicker(); // close only when range is complete
  };

  const increaseCapacity = () => setCapacity((prev) => prev + 1);
  const decreaseCapacity = () => {
    if (capacity > 1) setCapacity((prev) => prev - 1);
  };

  // Only fetch when both dates are valid and in order
  const getAll = useCallback(async () => {
    if (!checkIn || !checkOut || !checkOut.isAfter(checkIn)) return;
    try {
      const response = await axiosClient.get("/portal/rooms/available", {
        params: {
          page: 1,
          size: 10,
          startDate: checkIn.format("YYYY-MM-DD"),
          endDate: checkOut.format("YYYY-MM-DD"),
        },
      });
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

  // Date label shown inside the trigger box — matches RoomData exactly
  const dateLabel =
    checkIn && checkOut
      ? `${formatShort(checkIn)} – ${formatShort(checkOut)}`
      : checkIn
      ? `${formatShort(checkIn)} – Select check-out`
      : "Select dates";

  return (
    <>
      {/* Title */}
      <Typography variant="h5" sx={{ fontWeight: 700, color: "#152c5b" }}>
        Start Booking
      </Typography>

      {/* ── DATE SECTION ──────────────────────────────────────────────── */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {/* Label — same style as RoomData */}
        <Typography
          sx={{ fontSize: 11.5, color: "#9A97AE", fontWeight: 600 }}
        >
          Pick a Date
        </Typography>

        {/* Trigger box — exactly matches RoomData */}
        <Box
          onClick={openDatePicker}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            border: "1px solid #EFEDF8",
            borderRadius: 1.5,
            px: 1.5,
            py: 1,
            cursor: "pointer",
            transition: "border-color 0.15s",
            "&:hover": { borderColor: "#D9D3F7" },
          }}
        >
          <CalendarMonthOutlinedIcon sx={{ fontSize: 17, color: "#3D2EBF" }} />
          <Typography
            sx={{
              fontSize: 12.5,
              color: checkIn ? "#1F1B3C" : "#9A97AE",
              fontWeight: 500,
            }}
          >
            {dateLabel}
          </Typography>
        </Box>

        {/* Popover with the custom calendar */}
        <Popover
          open={Boolean(dateAnchor)}
          anchorEl={dateAnchor}
          onClose={closeDatePicker}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
          slotProps={{
            paper: {
              sx: {
                borderRadius: 2,
                border: "1px solid #EFEDF8",
                boxShadow: "0 12px 32px -16px rgba(70,40,200,0.25)",
              },
            },
          }}
        >
          <DateRangeCalendar
            checkIn={checkIn}
            checkOut={checkOut}
            onSelect={handleDateSelect}
          />
        </Popover>
      </Box>

      {/* ── CAPACITY ──────────────────────────────────────────────────── */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Typography sx={{ fontWeight: 600, color: "#152c5b" }}>
          Capacity
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            bgcolor: "#f8f9fb",
            borderRadius: 2,
            border: "1px solid #eee",
            overflow: "hidden",
          }}
        >
          <IconButton
            onClick={decreaseCapacity}
            disabled={capacity <= 1}
            sx={{
              width: 80,
              height: 60,
              borderRadius: 0,
              bgcolor: capacity <= 1 ? "#F1F5F9" : "#E74C3C",
              color: capacity <= 1 ? "#CBD5E1" : "#fff",
              "&:hover": { bgcolor: capacity <= 1 ? "#F1F5F9" : "#C0392B" },
              transition: "background-color 0.2s",
            }}
          >
            <RemoveIcon />
          </IconButton>

          <Typography
            sx={{
              flex: 1,
              textAlign: "center",
              fontSize: 18,
              fontWeight: 600,
              color: "#152c5b",
            }}
          >
            {capacity} {capacity === 1 ? "Person" : "People"}
          </Typography>

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

      {/* ── EXPLORE BUTTON ────────────────────────────────────────────── */}
      <CustomButton
        text="Explore Now"
        onClick={handleExplore}
        variant="primary"
        size="large"
      />
    </>
  );
}