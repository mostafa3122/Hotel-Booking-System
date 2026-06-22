import { Box, Chip, Typography } from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axiosClient from "../../../../services/api/axiosClient";
import Header from "../../../../shared/Header/Header";
import ConfirmationDialog from "../../../../shared/components/ConfirmationDialog/ConfirmationDialog";
import CustomTable from "../../../../shared/components/CustomTable/CustomTable";
import AddAd from "../AddAd/AddAd";
import ViewModal from "../../../../shared/components/ViewModal/ViewModal";

interface Ad {
  _id: string;
  isActive: boolean;
  discount: number;
  room: {
    _id: string;
    roomNumber: string;
    price: number;
    capacity: number;
    discount: number;
    images: string[];
  };
  createdBy: {
    _id: string;
    userName: string;
  };
  createdAt: string;
}
export default function AdsList() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [openView, setOpenView] = useState(false);
  const [selectedAdView, setSelectedAdView] = useState<Ad | null>(null);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  // Delete
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  // Add
  const [openAdd, setOpenAdd] = useState(false);

  const fetchAds = async (page: number, size: number) => {
    try {
      setLoading(true);
      const apiPage = page + 1;
      const response = await axiosClient.get(`/admin/ads`, {
        params: {
          page: apiPage,
          size: size,
        },
      });
      const adsData = response.data?.data?.ads || [];
      const count = response.data?.data?.totalCount || adsData.length;
      setAds(adsData);
      setTotalCount(count);
    } catch (error) {
      toast.error("Failed to fetch Ads");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAds(paginationModel.page, paginationModel.pageSize);
  }, [paginationModel]);

  const handleView = (row: Ad) => {
  setSelectedAdView(row);
  setOpenView(true);
  };

  const handleEdit = (row: Ad) => {
    setSelectedAd(row);
    setOpenAdd(true);
  };
  const handleDelete = (row: Ad) => {
    setSelectedAd(row);
    setOpenDelete(true);
  };
  const confirmDelete = async () => {
    if (!selectedAd) return;
    try {
      setDeleteLoading(true);
      await axiosClient.delete(`/admin/ads/${selectedAd._id}`);
      toast.success(
        `Room ${selectedAd.room.roomNumber} ad deleted successfully`
      );
      fetchAds(paginationModel.page, paginationModel.pageSize);
      setOpenDelete(false);
      setSelectedAd(null);
    } catch (error: any) {
      toast.error(error?.response?.data || "Failed to delete ad");
    } finally {
      setDeleteLoading(false);
    }
  };
  const columns: GridColDef<Ad>[] = [
    {
      field: "roomNumber",
      headerName: "Room Number",
      flex: 1,
      valueGetter: (_, row) => row.room.roomNumber,
    },
    {
      field: "price",
      headerName: "Price",
      flex: 1,
      valueGetter: (_, row) => row.room.price,
    },
    {
      field: "capacity",
      headerName: "Capacity",
      flex: 1,
      valueGetter: (_, row) => row.room.capacity,
    },
    {
      field: "discount",
      headerName: "Discount",
      flex: 1,
      renderCell: (params) => (
        <Typography>{params.row.room.discount}%</Typography>
      ),
    },
    {
      field: "isActive",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => (
        <Chip
          label={params.value ? "Active" : "Inactive"}
          size="small"
          color={params.value ? "success" : "error"}
          variant="filled"
          sx={{
            fontWeight: 600,
            minWidth: 90,
          }}
        />
      ),
    },
    {
      field: "createdBy",
      headerName: "Created By",
      flex: 1,
      valueGetter: (_, row) => row.createdBy.userName,
    },
  ];

  // view
  const viewRows = selectedAdView
    ? [
        { label: "ID", value: selectedAdView._id },

        {
          label: "Room Number",
          value: selectedAdView.room?.roomNumber,
        },

        {
          label: "Images",
          value: (
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {selectedAdView.room?.images?.map((img, i) => (
                <Box
                  key={i}
                  component="img"
                  src={img}
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: 1,
                    objectFit: "cover",
                  }}
                />
              ))}
            </Box>
          ),
        },

        {
          label: "Price",
          value: selectedAdView.room?.price?.toLocaleString(),
        },

        {
          label: "Capacity",
          value: selectedAdView.room?.capacity,
        },

        {
          label: "Discount",
          value: `${selectedAdView.room?.discount}%`,
        },

        {
          label: "Status",
          value: (
            <Chip
              label={selectedAdView.isActive ? "Active" : "Inactive"}
              size="small"
              color={selectedAdView.isActive ? "success" : "error"}
            />
          ),
        },

        {
          label: "Created By",
          value: selectedAdView.createdBy?.userName,
        },

        {
          label: "Created At",
          value: new Date(selectedAdView.createdAt).toLocaleDateString(),
        },
      ]
    : [];
  return (
    <Box>
      <Header
        title="Ads Table Details"
        subtitle="You can check all details"
        btnText="Add New Ads"
        onBtnClick={() => {
          setSelectedAd(null);
          setOpenAdd(true);
        }}
      />
      <CustomTable
        rows={ads}
        columns={columns}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        rowCount={totalCount}
        loading={loading}
        paginationMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
      />
      <ConfirmationDialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={confirmDelete}
        loading={deleteLoading}
        title="Delete This Ad ?"
        message={`Are you sure you want to delete ads for this room ${selectedAd?.room?.roomNumber}? if you are sure just click on delete it`}
      />
      <AddAd
        open={openAdd}
        onClose={() => {
          setOpenAdd(false);
          setSelectedAd(null);
        }}
        onSuccess={() =>
          fetchAds(paginationModel.page, paginationModel.pageSize)
        }
        adData={selectedAd}
      />
      <ViewModal
        open={openView}
        onClose={() => setOpenView(false)}
        title="Ad Details"
        rows={viewRows}
      />
    </Box>
  );
}
