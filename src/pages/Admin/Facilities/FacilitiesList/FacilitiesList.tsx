import { useEffect, useMemo, useState } from "react";
import axiosClient from "../../../../services/api/axiosClient";
import CustomTable from "../../../../shared/components/CustomTable/CustomTable";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import Header from "../../../../shared/Header/Header";
import AddFacility from "../AddFacilityModal/AddFacility";
import ConfirmationDialog from "../../../../shared/components/ConfirmationDialog/ConfirmationDialog";
import { toast } from "react-toastify";

type Facility = {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: {
    userName: string;
  };
};

export default function FacilitiesList() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(
    null,
  );

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const [rowCount, setRowCount] = useState(0);

  // ================= FETCH =================
  const getFacilities = async (page: number, size: number) => {
    try {
      setLoading(true);

      const apiPage = page + 1;

      const res = await axiosClient.get("/admin/room-facilities", {
        params: { page: apiPage, size },
      });

      const data = res.data?.data?.facilities || [];
      const count = res.data?.data?.totalCount || data.length;

      setFacilities(data);
      setRowCount(count);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to fetch facilities",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFacilities(paginationModel.page, paginationModel.pageSize);
  }, [paginationModel.page, paginationModel.pageSize]);

  // ================= DELETE =================
  const handleDelete = (row: Facility) => {
    setSelectedFacility(row);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedFacility?._id) return;

    try {
      setDeleteLoading(true);

      const res = await axiosClient.delete(
        `/admin/room-facilities/${selectedFacility._id}`,
      );

      toast.success(res.data?.message);

      setDeleteOpen(false);
      setSelectedFacility(null);

      getFacilities(paginationModel.page, paginationModel.pageSize);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to delete facility",
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  // ================= EDIT =================
  const handleEdit = (row: Facility) => {
    setSelectedFacility(row);
    setOpen(true);
  };

  const handleView = (row: Facility) => {
    console.log("View:", row);
  };

  // ================= COLUMNS =================
  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "name",
        headerName: "Facility Name",
        minWidth: 220,
        flex: 1,
      },
      {
        field: "createdBy",
        headerName: "Created By",
        minWidth: 180,
        flex: 1,
        renderCell: (params: GridRenderCellParams) =>
          params.value?.userName || "Unknown",
      },
      {
        field: "createdAt",
        headerName: "Created At",
        minWidth: 180,
        flex: 1,
        renderCell: (params) =>
          new Date(params.row.createdAt).toLocaleDateString("en-GB"),
      },
      {
        field: "updatedAt",
        headerName: "Updated At",
        minWidth: 180,
        flex: 1,
        renderCell: (params) =>
          new Date(params.row.updatedAt).toLocaleDateString("en-GB"),
      },
    ],
    [],
  );

  // ================= UI =================
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 2,
      }}
    >
      <Header
        title="Facilities Table Details"
        subtitle="You can check all details"
        btnText="Add New Facility"
        onBtnClick={() => {
          setSelectedFacility(null);
          setOpen(true);
        }}
      />

      {/* ADD / EDIT MODAL */}
      <AddFacility
        open={open}
        onClose={() => {
          setOpen(false);
          setSelectedFacility(null);
        }}
        onSuccess={() =>
          getFacilities(paginationModel.page, paginationModel.pageSize)
        }
        facility={selectedFacility}
      />

      {/* DELETE MODAL */}
      <ConfirmationDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={confirmDelete}
        loading={deleteLoading}
        title="Delete Facility"
        message={`Are you sure you want to delete "${selectedFacility?.name}"?`}
        confirmText="Delete"
        loadingText="Deleting..."
      />

      {/* TABLE */}
      <CustomTable
        rows={facilities}
        columns={columns}
        loading={loading}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        rowCount={rowCount}
        paginationMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
      />
    </Box>
  );
}
