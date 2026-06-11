import { useState, useEffect } from 'react';
import { type GridColDef, type GridRenderCellParams, type GridRowsProp } from '@mui/x-data-grid';
import { Box, Typography } from '@mui/material';
import CustomTable from './components/CustomTable/CustomTable';
import axiosClient from '../services/api/axiosClient';

export default function Test() {
    const [rooms, setRooms] = useState<GridRowsProp>([]);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });

    const fetchRooms = async (page: number, size: number) => {
        try {
            setLoading(true);
            const apiPage = page + 1;
            const response = await axiosClient.get(`/admin/rooms`, {
                params: {
                    page: apiPage,
                    size: size,
                },
            });
            const roomsData = response.data?.data?.rooms || [];
            const count = response.data?.data?.totalCount || roomsData.length;
            setRooms(roomsData);
            setTotalCount(count);
        } catch (error) {
            console.error('Failed to fetch rooms:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRooms(paginationModel.page, paginationModel.pageSize);
    }, [paginationModel]);

    const handleView = (row: any) => {
        console.log('View action clicked on row:', row);
    };

    const handleEdit = (row: any) => {
        console.log('Edit action clicked on row:', row);
    };

    const handleDelete = (row: any) => {
        console.log('Delete action clicked on row:', row);
    };

    const columns: GridColDef[] = [
        { field: 'roomNumber', headerName: 'room Number', flex: 1, minWidth: 150 },
        {
            field: 'images',
            headerName: 'Image',
            flex: 0.8,
            minWidth: 100,
            renderCell: (params: GridRenderCellParams) => {
                const imageUrl = params.value?.[0];
                return imageUrl ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                        <Box
                            component="img"
                            src={imageUrl}
                            alt="Room"
                            sx={{
                                width: 48,
                                height: 40,
                                borderRadius: '8px',
                                objectFit: 'cover'
                            }}
                        />
                    </Box>
                ) : null;
            }
        },
        { field: 'price', headerName: 'Price', flex: 0.8, minWidth: 80 },
        { field: 'discount', headerName: 'Discount', flex: 0.8, minWidth: 110 },
        { field: 'capacity', headerName: 'Capacity', flex: 0.8, minWidth: 120 },
        {
            field: 'facilities',
            headerName: 'Facilities',
            flex: 2.5,
            minWidth: 220,
            renderCell: (params: GridRenderCellParams) => {
                const facilityNames = params.value?.map((f: any) => {
                    const name = typeof f === 'string' ? f : (f?.name || '');
                    return name.replace(/[-−–—\u2011_]/g, ' ').replace(/\bWi\s+Fi\b/gi, 'Wi-Fi');
                }).join(', ') || '';
                return (
                    <Typography
                        variant="body2"
                        component="span"
                        sx={{
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            fontFamily: 'Poppins',
                            fontSize: '14px'
                        }}
                    >
                        {facilityNames}
                    </Typography>
                );
            }
        },
    ];

    return (
        <Box sx={{ p: 2.5, width: '100%', minWidth: 0, overflow: 'hidden' }}>
            <Typography
                variant="h5"
                component="h2"
                sx={{
                    fontFamily: 'Poppins',
                    fontWeight: 600,
                    color: '#1F263E',
                    mb: 2.5
                }}
            >
                Rooms Management
            </Typography>
            <CustomTable
                rows={rooms}
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
        </Box>
    );
}




