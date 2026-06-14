import { useState, useEffect } from 'react';
import { type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid';
import { Box, Typography } from '@mui/material';
import CustomTable from './components/CustomTable/CustomTable';
import axiosClient from '../services/api/axiosClient';
import Header from './Header/Header';
import TableFilters from './components/TableFilters/TableFilters';
import useDebounce from './utils/useDebounce';

interface Facility {
    _id?: string;
    name: string;
}

interface Room {
    _id: string;
    roomNumber: string;
    images: string[];
    price: number;
    discount: number;
    capacity: number;
    facilities: (string | Facility)[];
}

export default function Test() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    
    const [searchValue, setSearchValue] = useState<string>('');
    const debouncedSearch = useDebounce(searchValue, 500);

    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });

    const fetchRooms = async (
        page: number,
        size: number,
        search: string
    ) => {
        try {
            setLoading(true);
            const apiPage = page + 1;
            const params: any = {
                page: apiPage,
                size: size,
            };
            if (search) {
                params.roomNumber = search;
            }

            console.log('fetchRooms API Request params:', params);
            const response = await axiosClient.get(`/admin/rooms`, { params });
            console.log('fetchRooms API Response:', response.data);

            const roomsData = response.data?.data?.rooms || [];
            console.log('Rooms extracted from response:', roomsData);
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
        setPaginationModel((prev) => ({ ...prev, page: 0 }));
    }, [debouncedSearch]);

   
    useEffect(() => {
        fetchRooms(
            paginationModel.page,
            paginationModel.pageSize,
            debouncedSearch
        );
    }, [paginationModel.page, paginationModel.pageSize, debouncedSearch]);

    const handleView = (row: Room) => {
        console.log('View action clicked on row:', row);
    };

    const handleEdit = (row: Room) => {
        console.log('Edit action clicked on row:', row);
    };

    const handleDelete = (row: Room) => {
        console.log('Delete action clicked on row:', row);
    };

    const columns: GridColDef<Room>[] = [
        { field: 'roomNumber', headerName: 'room Number', flex: 1, minWidth: 150 },
        {
            field: 'images',
            headerName: 'Image',
            flex: 0.8,
            minWidth: 100,
            renderCell: (params: GridRenderCellParams<Room>) => {
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
            renderCell: (params: GridRenderCellParams<Room>) => {
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
    
 
    const displayedRooms = rooms.filter((room) => {
        if (searchValue) {
            const searchStr = searchValue.toLowerCase();
            const roomNumStr = String(room.roomNumber).toLowerCase();
            if (!roomNumStr.includes(searchStr)) {
                return false;
            }
        }
        return true;
    });

    return (
        <Box sx={{ p: 2.5, width: '100%', minWidth: 0, overflow: 'hidden' }}>
            <Header
                title="Rooms Table Details"
                subtitle="You can check all details"
                btnText="Add New Room"
                onBtnClick={() => console.log('Add New Room clicked')}
            />
            <TableFilters
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                searchPlaceholder="Search here ..."
                fields={[]} // this will be used when you want to add filters (zy tag aw category )
            />
            <CustomTable
                rows={displayedRooms}
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




