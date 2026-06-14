
import { Box, TextField, Select, MenuItem, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export interface TableFilterField {
  id: string;
  label: string;  
  value: string | number;
  options: { value: string | number; label: string }[];
  onChange: (value: any) => void;
}

interface TableFiltersProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  fields?: TableFilterField[];
}

export default function TableFilters({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search here ...',
  fields = [],
}: TableFiltersProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 2,
        width: '100%',
        mb: 3,
        alignItems: 'center',
      }}
    >
    
      <TextField
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={searchPlaceholder}
        fullWidth
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#8A92A6', fontSize: '20px' }} />
              </InputAdornment>
            ),
          },
        }}
        sx={{
          flex: 1,
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#FFF',
            borderRadius: '12px',
            fontFamily: 'Poppins',
            fontSize: '14px',
            color: '#1F263E',
            '& fieldset': {
              borderColor: '#E2E5EB',
              borderWidth: '1px',
            },
            '&:hover fieldset': {
              borderColor: '#C2C6CE',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#203FC7',
              borderWidth: '1.5px',
            },
          },
          '& .MuiOutlinedInput-input': {
            padding: '12px 14px 12px 0',
            fontFamily: 'Poppins',
            fontSize: '14px',
            '&::placeholder': {
              color: '#8A92A6',
              opacity: 0.8,
            },
          },
        }}
      />

    
      {fields.map((field) => (
        <Select
          key={field.id}
          value={field.value}
          onChange={(e) => field.onChange(e.target.value)}
          displayEmpty
          IconComponent={KeyboardArrowDownIcon}
          renderValue={(selected) => {
            if (selected === '' || selected === undefined || selected === null) {
              return <span style={{ color: '#8A92A6', opacity: 0.8 }}>{field.label}</span>;
            }
            const foundOption = field.options.find((opt) => opt.value === selected);
            return foundOption ? foundOption.label : selected;
          }}
          sx={{
            width: { xs: '100%', md: '180px' },
            backgroundColor: '#FFF',
            borderRadius: '12px',
            fontFamily: 'Poppins',
            fontSize: '14px',
            color: '#1F263E',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#E2E5EB',
              borderWidth: '1px',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#C2C6CE',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#203FC7',
              borderWidth: '1.5px',
            },
            '& .MuiSelect-select': {
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
            },
            '& .MuiSvgIcon-root': {
              color: '#8A92A6',
              right: '12px',
            },
          }}
          MenuProps={{
            slotProps: {
              paper: {
                sx: {
                  borderRadius: '12px',
                  mt: 1,
                  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
                  border: '1px solid #F1F5F9',
                  '& .MuiMenuItem-root': {
                    fontFamily: 'Poppins',
                    fontSize: '14px',
                    color: '#1F263E',
                    py: 1,
                    px: 2,
                    '&:hover': {
                      backgroundColor: '#F8FAFC',
                    },
                    '&.Mui-selected': {
                      backgroundColor: '#E2E5EB',
                      fontWeight: 500,
                      '&:hover': {
                        backgroundColor: '#D2D6DF',
                      },
                    },
                  },
                },
              },
            },
          }}
        >
     
          <MenuItem value="">
            <em>All {field.label}s</em>
          </MenuItem>
          {field.options.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
      ))}
    </Box>
  );
}
