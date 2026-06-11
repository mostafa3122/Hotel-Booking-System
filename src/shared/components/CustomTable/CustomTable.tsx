import { useState } from 'react';
import { DataGrid, type GridColDef, type GridRenderCellParams, type GridRowsProp } from '@mui/x-data-grid';
import { Paper, IconButton, Menu, MenuItem } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

interface CustomTableProps {
    rows: GridRowsProp;
    columns: GridColDef[];
    onView?: (row: any) => void;
    onEdit?: (row: any) => void;
    onDelete?: (row: any) => void;
    rowCount?: number;
    loading?: boolean;
    paginationMode?: 'client' | 'server';
    paginationModel?: { page: number; pageSize: number };
    onPaginationModelChange?: (model: any) => void;
    height?: string | number;
}

export default function CustomTable({
    rows,
    columns,
    onView,
    onEdit,
    onDelete,
    rowCount,
    loading,
    paginationMode = 'client',
    paginationModel,
    onPaginationModelChange,
    height = 500
}: CustomTableProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedRow, setSelectedRow] = useState<any>(null);

    const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, row: any) => {
        setAnchorEl(event.currentTarget);
        setSelectedRow(row);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const hasActions = onView || onEdit || onDelete;

    const finalColumns: GridColDef[] = hasActions
        ? [
            ...columns,
            {
                field: 'actions',
                headerName: '',
                sortable: false,
                filterable: false,
                width: 80,
                align: 'center',
                headerAlign: 'center',
                renderCell: (params: GridRenderCellParams) => (
                    <IconButton onClick={(e) => handleOpenMenu(e, params.row)}>
                        <MoreHorizIcon sx={{ color: '#1F263E' }} />
                    </IconButton>
                ),
            },
        ]
        : columns;

    return (
        <>
            <DataGrid
                rows={rows}
                columns={finalColumns}
                rowHeight={64}
                columnHeaderHeight={88}
                disableRowSelectionOnClick
                getRowId={(row) => row._id || row.id}
                rowCount={rowCount}
                loading={loading}
                paginationMode={paginationMode}
                paginationModel={paginationModel}
                onPaginationModelChange={onPaginationModelChange}
                pageSizeOptions={[5, 10, 20]}
                sx={{
                    height: height,
                    width: '100%',
                    borderRadius: '15px',
                    overflow: 'hidden',
                    backgroundColor: 'white',
                    border: 'none',
                    '&, & .MuiDataGrid-cell, & .MuiDataGrid-row, & .MuiDataGrid-columnHeaders, & .MuiDataGrid-columnHeader, & .MuiDataGrid-footerContainer, & .MuiDataGrid-withBorderColor': {
                        borderBottom: 'none !important',
                        borderTop: 'none !important',
                        borderColor: 'transparent !important',
                    },
                    '& .MuiDataGrid-columnHeaders, & .MuiDataGrid-columnHeaders .MuiDataGrid-scrollbarFiller, & .MuiDataGrid-columnHeaders .MuiDataGrid-filler, & .MuiDataGrid-scrollbarFiller--header': {
                        backgroundColor: '#E2E5EB !important',
                    },
                    '& .MuiDataGrid-columnHeader': {
                        backgroundColor: '#E2E5EB !important',
                        color: '#1F263E',
                        fontFamily: 'Poppins',
                        px: 2.5,
                        '&:first-of-type': {
                            pl: 4,
                        },
                        '&:focus, &:focus-within': {
                            outline: 'none',
                        },
                    },
                    '& .MuiDataGrid-columnHeaderTitle': {
                        fontWeight: '500',
                        fontSize: '16px',
                        fontStyle: 'medium',
                    },
                    '& .MuiDataGrid-columnSeparator': {
                        display: 'none',
                    },
                    '& .MuiDataGrid-cell': {
                        display: 'flex',
                        alignItems: 'center',
                        fontFamily: 'Poppins',
                        fontWeight: '400',
                        fontSize: '14px',
                        fontStyle: 'normal',
                        color: '#3A3A3D',
                        px: 2.5,
                        '&:first-of-type': {
                            pl: 4,
                        },
                        '&:focus, &:focus-within': {
                            outline: 'none',
                        },
                    },
                    '& .MuiDataGrid-cell[data-field="actions"]': {
                        overflow: 'visible',
                        textOverflow: 'unset',
                    },
                    '& .MuiDataGrid-row:nth-of-type(even)': {
                        backgroundColor: '#F8F9FB',
                    },
                }}
            />

            {hasActions && (
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleCloseMenu}
                    slotProps={{
                        paper: {
                            elevation: 0,
                            sx: {
                                overflow: 'visible',
                                filter: 'drop-shadow(0px 4px 20px rgba(0, 0, 0, 0.08))',
                                borderRadius: '16px',
                                mt: 1.5,
                                border: '1px solid #F1F5F9',
                                minWidth: '160px',
                                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.05), 0 4px 6px -4px rgb(0 0 0 / 0.05)',
                                '& .MuiList-root': {
                                    py: 0.5,
                                },
                                '& .MuiMenuItem-root': {
                                    fontFamily: 'Poppins',
                                    fontSize: '14px',
                                    fontWeight: '400',
                                    color: '#1F263E',
                                    py: 1.2,
                                    px: 2.5,
                                    gap: 1.5,
                                    borderBottom: '1px solid #F1F5F9',
                                    '&:last-child': {
                                        borderBottom: 'none',
                                    },
                                    '&:hover': {
                                        backgroundColor: '#F8FAFC',
                                    },
                                },
                                '&::before': {
                                    content: '""',
                                    display: 'block',
                                    position: 'absolute',
                                    top: 0,
                                    right: 14,
                                    width: 10,
                                    height: 10,
                                    bgcolor: 'background.paper',
                                    transform: 'translateY(-50%) rotate(45deg)',
                                    zIndex: 0,
                                    borderLeft: '1px solid #F1F5F9',
                                    borderTop: '1px solid #F1F5F9',
                                },
                            },
                        },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                    {onView && (
                        <MenuItem onClick={() => { onView(selectedRow); handleCloseMenu(); }}>
                            <VisibilityOutlinedIcon sx={{ fontSize: '18px', color: '#203FC7' }} />
                            View
                        </MenuItem>
                    )}
                    {onEdit && (
                        <MenuItem onClick={() => { onEdit(selectedRow); handleCloseMenu(); }}>
                            <EditOutlinedIcon sx={{ fontSize: '18px', color: '#203FC7' }} />
                            Edit
                        </MenuItem>
                    )}
                    {onDelete && (
                        <MenuItem onClick={() => { onDelete(selectedRow); handleCloseMenu(); }}>
                            <DeleteOutlinedIcon sx={{ fontSize: '18px', color: '#203FC7' }} />
                            Delete
                        </MenuItem>
                    )}
                </Menu>
            )}
        </>
    );
}

