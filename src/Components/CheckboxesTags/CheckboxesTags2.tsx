import React, { useState } from 'react';
import {
  Autocomplete,
  Box,
  Checkbox,
  Chip,
  TextField,
} from '@mui/material';
import { CloseOutlined } from '@mui/icons-material';
import { FilmOption, top100Films } from './CheckboxesTags';

const CheckboxesTags2 = () => {
  const [selectedOptions, setSelectedOptions] = useState<FilmOption[]>(top100Films);

  return (
    <Autocomplete
      multiple
      limitTags={2}
      options={top100Films}
      value={selectedOptions}
      onChange={(_, newValue) => setSelectedOptions(newValue)}
      getOptionLabel={(option) => option.title}
      renderTags={(tagValue, getTagProps) => (
        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
          {tagValue.slice(0, 2).map((option, index) => (
            <Chip
            //   key={option.year}
              label={option.title}
              {...getTagProps({ index })}
              size="small"
              deleteIcon={<CloseOutlined sx={{ color: '#004d40' }} />}
              sx={{
                backgroundColor: '#e0f7fa',
                color: '#00695c',
                '& .MuiChip-deleteIcon': {
                  marginLeft: 'auto',
                  cursor: 'pointer',
                },
              }}
            />
          ))}
          {tagValue.length > 2 && (
            <Chip
              label={`+${tagValue.length - 2}`}
              size="small"
              sx={{
                borderRadius: '16px',
                height: '24px',
                minWidth: '24px',
                padding: '0 6px',
                backgroundColor: 'rgba(0, 0, 0, 0.08)',
                color: 'rgba(0, 0, 0, 0.87)',
                fontWeight: 400,
                '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.12)' },
              }}
            />
          )}
        </Box>
      )}
      renderOption={(props, option, { selected }) => (
        <li {...props} style={{ display: 'flex', alignItems: 'center' }}>
          <Checkbox checked={selected} sx={{ marginRight: 1 }} />
          {option.title}
        </li>
      )}
      renderInput={(params) => (
        <TextField {...params} label="Movies" placeholder="Select movies" fullWidth />
      )}
      sx={{ width: 500, '& .MuiChip-root': { fontSize: '0.876rem', lineHeight: 1.5 } }}
    />
  );
};

export default CheckboxesTags2;
