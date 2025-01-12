import React, { useState } from 'react';
import {
  Select,
  MenuItem,
  Chip,
  Checkbox,
  ListItemText,
  InputLabel,
  FormControl,
  Box,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const FixedInputContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  border: '1px solid #ccc',
  borderRadius: '4px',
  padding: '4px 8px',
  height: '40px',
  cursor: 'pointer',
});

const ChipWithPlus = styled(Chip)({
  margin: '2px',
  cursor: 'pointer',
});

const allOptions = Array.from({ length: 10 }, (_, index) => `Option ${index + 1}`);

const ChipComp: React.FC = () => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [selectOpen, setSelectOpen] = useState(false);

  const handleSelectChange = (event: any) => {
    const {
      target: { value },
    } = event;

    if (value.includes('all')) {
      if (selectedOptions.length === allOptions.length) {
        setSelectedOptions([]);
      } else {
        setSelectedOptions(allOptions);
      }
    } else {
      setSelectedOptions(value);
    }
  };

  return (
    <Box>
      <FormControl fullWidth>
        <InputLabel id="multi-select-label">Select Options</InputLabel>
        <Box onClick={() => setSelectOpen(true)}>
          <FixedInputContainer>
            {selectedOptions.slice(0, 2).map((value: string) => (
              <ChipWithPlus key={value} label={value} />
            ))}
            {selectedOptions.length > 2 && (
              <ChipWithPlus label={`+${selectedOptions.length - 2}`} />
            )}
          </FixedInputContainer>
        </Box>
        <Select
          labelId="multi-select-label"
          multiple
          value={selectedOptions}
          onChange={handleSelectChange}
          open={selectOpen}
          onClose={() => setSelectOpen(false)}
          renderValue={() => null} // No chips inside the dropdown
        >
          <MenuItem value="all">
            <Checkbox
              checked={selectedOptions.length === allOptions.length}
              indeterminate={
                selectedOptions.length > 0 &&
                selectedOptions.length < allOptions.length
              }
            />
            <ListItemText primary="Select All" />
          </MenuItem>
          {allOptions.map((option) => (
            <MenuItem key={option} value={option}>
              <Checkbox checked={selectedOptions.indexOf(option) > -1} />
              <ListItemText primary={option} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default ChipComp;
