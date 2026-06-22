import { useEffect, useMemo, useState } from "react";
import { Box, Avatar, Chip } from "@mui/material";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import axiosClient from "../../../../services/api/axiosClient";

import CustomTable from "../../../../shared/components/CustomTable/CustomTable";
import Header from "../../../../shared/Header/Header";
import { toast } from "react-toastify";
import ViewModal from "../../../../shared/components/ViewModal/ViewModal";

type User = {
  _id: string;
  userName: string;
  email: string;
  phoneNumber: number;
  country: string;
  role: string;
  verified: boolean;
  profileImage: string;
  createdAt: string;
  updatedAt: string;
};

export default function UsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

const [viewOpen, setViewOpen] = useState(false);
const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const [rowCount, setRowCount] = useState(0);

  // ================= FETCH USERS =================

  const getUsers = async (page: number, size: number) => {
    try {
      setLoading(true);

      const apiPage = page + 1;

      const res = await axiosClient.get("/admin/users", {
        params: {
          page: apiPage,
          size,
        },
      });

      const usersData = res.data?.data?.users || [];
      const totalCount = res.data?.data?.totalCount || 0;

      setUsers(usersData);
      setRowCount(totalCount);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers(paginationModel.page, paginationModel.pageSize);
  }, [paginationModel.page, paginationModel.pageSize]);

  // ================= VIEW =================

  const handleView = (row: User) => {
   setSelectedUser(row);
   setViewOpen(true);
  };

 
 
  // ================= COLUMNS =================

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "profileImage",
        headerName: "Image",
        width: 100,
        sortable: false,
        renderCell: (params: GridRenderCellParams) => (
          <Avatar
            src={params.value}
            alt={params.row.userName}
            sx={{
              width: 45,
              height: 45,
            }}
          />
        ),
      },
      {
        field: "userName",
        headerName: "User Name",
        minWidth: 180,
        flex: 1,
      },
      {
        field: "email",
        headerName: "Email",
        minWidth: 250,
        flex: 1,
      },
      {
        field: "phoneNumber",
        headerName: "Phone Number",
        minWidth: 150,
      },
      {
        field: "country",
        headerName: "Country",
        minWidth: 120,
      },
      {
        field: "role",
        headerName: "Role",
        minWidth: 120,
        renderCell: (params: GridRenderCellParams) => (
          <Chip
            label={params.value}
            color={params.value === "admin" ? "error" : "primary"}
            size="small"
          />
        ),
      },
      {
        field: "verified",
        headerName: "Verified",
        minWidth: 130,
        renderCell: (params: GridRenderCellParams) => (
          <Chip
            label={params.value ? "Verified" : "Not Verified"}
            color={params.value ? "success" : "warning"}
            size="small"
          />
        ),
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

  // ================= View =================
  const viewRows = selectedUser
    ? [
        { label: "ID", value: selectedUser._id },

        {
          label: "Avatar",
          value: (
            <Avatar
              src={selectedUser.profileImage}
              sx={{ width: 50, height: 50, ml: "auto" }}
            />
          ),
        },

        { label: "User Name", value: selectedUser.userName },

        { label: "Email", value: selectedUser.email },

        { label: "Phone", value: selectedUser.phoneNumber },

        { label: "Country", value: selectedUser.country },

        {
          label: "Role",
          value: (
            <Chip
              label={selectedUser.role}
              color={selectedUser.role === "admin" ? "error" : "primary"}
              size="small"
            />
          ),
        },

        {
          label: "Verified",
          value: (
            <Chip
              label={selectedUser.verified ? "Verified" : "Not Verified"}
              color={selectedUser.verified ? "success" : "warning"}
              size="small"
            />
          ),
        },

        {
          label: "Created At",
          value: new Date(selectedUser.createdAt).toLocaleDateString("en-GB"),
        },

        {
          label: "Updated At",
          value: new Date(selectedUser.updatedAt).toLocaleDateString("en-GB"),
        },
      ]
    : [];
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
        title="Users Table Details"
        subtitle="You can check all users details"
      />

      <CustomTable
        rows={users}
        columns={columns}
        loading={loading}
        rowCount={rowCount}
        paginationMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        onView={handleView}
      />
      <ViewModal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        title="User Details"
        rows={viewRows}
      />
    </Box>
  );
}
