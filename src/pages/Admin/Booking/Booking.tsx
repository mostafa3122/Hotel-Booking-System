import { Box, Chip } from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axiosClient from "../../../services/api/axiosClient";
import Header from "../../../shared/Header/Header";
import CustomTable from "../../../shared/components/CustomTable/CustomTable";
import ViewModal from "../../../shared/components/ViewModal/ViewModal";
import ConfirmationDialog from "../../../shared/components/ConfirmationDialog/ConfirmationDialog";
// import axiosClient from "../../../../services/api/axiosClient";
// import Header from "../../../../shared/Header/Header";
// import CustomTable from "../../../../shared/components/CustomTable/CustomTable";

interface Booking {
  _id: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  user: {
    _id: string;
    userName: string;
  };
  room: {
    _id: string;
    roomNumber: string;
  };
}

export default function BookingsList() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const fetchBookings = async (page: number, size: number) => {
    try {
      setLoading(true);

      const response = await axiosClient.get("/admin/booking", {
        params: {
          page: page + 1,
          size,
        },
      });

      const bookingsData = response.data?.data?.booking || [];
      const count = response.data?.data?.totalCount || bookingsData.length;
      console.log(response.data.data.bookings);
      setBookings(bookingsData);
      setTotalCount(count);
    } catch (error) {
      toast.error("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings(paginationModel.page, paginationModel.pageSize);
  }, [paginationModel]);

  const handleView = (row: Booking) => {
   setSelectedBooking(row);
   setOpen(true);
  };
const handleDelete = (row: Booking) => {
  setSelectedBooking(row);
  setDeleteOpen(true);
};
const confirmDelete = async () => {
  if (!selectedBooking) return;

  try {
    setDeleteLoading(true);

    await axiosClient.delete(`/admin/booking/${selectedBooking._id}`);

    toast.success("Booking deleted successfully");

    setDeleteOpen(false);
    setSelectedBooking(null);

    fetchBookings(paginationModel.page, paginationModel.pageSize);
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Failed to delete booking");
  } finally {
    setDeleteLoading(false);
  }
};
  const columns: GridColDef<Booking>[] = [
    {
      field: "roomNumber",
      headerName: "Room Number",
      flex: 1,
      valueGetter: (_, row) => row.room?.roomNumber || "N/A",
    },
    {
      field: "userName",
      headerName: "User Name",
      flex: 1,
      valueGetter: (_, row) => row.user?.userName || "Unknown",
    },
    {
      field: "startDate",
      headerName: "Start Date",
      flex: 1,
      valueGetter: (_, row) => new Date(row.startDate).toLocaleDateString(),
    },
    {
      field: "endDate",
      headerName: "End Date",
      flex: 1,
      valueGetter: (_, row) => new Date(row.endDate).toLocaleDateString(),
    },
    {
      field: "totalPrice",
      headerName: "Total Price",
      flex: 1,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          color={
            params.value === "completed"
              ? "success"
              : params.value === "pending"
              ? "warning"
              : params.value === "cancelled"
              ? "error"
              : "default"
          }
          sx={{
            minWidth: 100,
            fontWeight: 600,
            textTransform: "capitalize",
          }}
        />
      ),
    },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 1,
      valueGetter: (_, row) => new Date(row.createdAt).toLocaleDateString(),
    },
  ];

  // view
  const viewRows = selectedBooking
    ? [
        { label: "ID", value: selectedBooking._id },
        { label: "Room Number", value: selectedBooking.room?.roomNumber },
        { label: "User", value: selectedBooking.user?.userName },
        {
          label: "Status",
          value: (
            <Chip
              label={selectedBooking.status}
              size="small"
              sx={{
                background:
                  selectedBooking.status === "pending" ? "#FFF3E0" : "#E8F5E9",
                color:
                  selectedBooking.status === "pending" ? "#E65100" : "#2E7D32",
                fontWeight: 600,
                fontSize: "0.78rem",
              }}
            />
          ),
        },
        {
          label: "Start Date",
          value: new Date(selectedBooking.startDate).toLocaleDateString(),
        },
        {
          label: "End Date",
          value: new Date(selectedBooking.endDate).toLocaleDateString(),
        },
        {
          label: "Total Price",
          value: selectedBooking.totalPrice?.toLocaleString(),
        },
        {
          label: "Created At",
          value: new Date(selectedBooking.createdAt).toLocaleDateString(),
        },
      ]
    : [];
  return (
    <Box>
      <Header
        title="Bookings Table Details"
        subtitle="You can check all bookings details"
      />

      <CustomTable
        rows={bookings}
        columns={columns}
        onView={handleView}
        onDelete={handleDelete}
        rowCount={totalCount}
        loading={loading}
        paginationMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
      />
      <ViewModal
        open={open}
        onClose={() => setOpen(false)}
        title="Booking Details"
        rows={viewRows}
      />
      <ConfirmationDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={confirmDelete}
        loading={deleteLoading}
        title="Delete Booking"
        message={`Are you sure you want to delete booking ${selectedBooking?.room?.roomNumber}?`}
      />
    </Box>
  );
}
