import React, { useState, useRef, useEffect } from 'react';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';

export type FilmOption = {
  title: string;
  year?: number;
};

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export const top100Films: FilmOption[] = [
  { title: 'The Shawshank Redemption', year: 1994 },
  { title: 'The Godfather', year: 1972 },
  { title: 'The Dark Knight', year: 2008 },
  { title: '12 Angry Men', year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: 'Pulp Fiction', year: 1994 },
  // Add more items as needed...
];

export default function CheckboxesTags(): JSX.Element {
  const [selectedOptions, setSelectedOptions] = useState<FilmOption[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [visibleTags, setVisibleTags] = useState<number>(0);
  const inputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const calculateVisibleTags = () => {
      if (inputRef.current) {
        const input = inputRef.current;
        const inputWidth = input.offsetWidth;
        const averageTagWidth = 100; // Approximate width of each tag
        const maxTags = Math.floor((inputWidth - 120) / averageTagWidth); // Additional space for counter chip
        setVisibleTags(Math.max(1, maxTags));
      }
    };

    calculateVisibleTags();
    window.addEventListener('resize', calculateVisibleTags);
    return () => window.removeEventListener('resize', calculateVisibleTags);
  }, []);

  const handleSelectionChange = (
    event: React.ChangeEvent<{}>,
    newValue: (FilmOption | string)[]
  ): void => {
    if (newValue.includes('Select All')) {
      setSelectedOptions(
        selectedOptions.length === top100Films.length ? [] : top100Films
      );
    } else {
      setSelectedOptions(newValue.filter((option): option is FilmOption => typeof option !== 'string'));
    }
  };

  const getFilteredAndSortedOptions = (searchInput: string): (FilmOption | string)[] => {
    if (!searchInput) {
      return ['Select All', ...top100Films];
    }

    const searchLower = searchInput.toLowerCase();
    const filteredOptions = top100Films.filter(
      (film) => film.title.toLowerCase().includes(searchLower)
    );

    const sortedOptions = filteredOptions.sort((a, b) => {
      const aLower = a.title.toLowerCase();
      const bLower = b.title.toLowerCase();

      const aExact = aLower === searchLower;
      const bExact = bLower === searchLower;
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;

      const aStarts = aLower.startsWith(searchLower);
      const bStarts = bLower.startsWith(searchLower);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;

      return aLower.localeCompare(bLower);
    });

    return ['Select All', ...sortedOptions];
  };

  return (
    <Autocomplete
      multiple
      id="checkboxes-tags-demo"
      options={getFilteredAndSortedOptions(inputValue)}
      value={selectedOptions}
      disableCloseOnSelect
      onChange={handleSelectionChange}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      getOptionLabel={(option: FilmOption | string) =>
        typeof option === 'string' ? option : option.title
      }
      renderOption={(props, option, { selected }) => {
        const isSelectAll = option === 'Select All';
        const isSelected = isSelectAll
          ? selectedOptions.length === top100Films.length
          : typeof option !== 'string' &&
            selectedOptions.some(
              (selectedOption) => selectedOption.title === option.title
            );

        return (
          <li {...props}>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={isSelected}
            />
            {isSelectAll ? 'Select All' : (option as FilmOption).title}
          </li>
        );
      }}
      renderTags={(tagValue, getTagProps) => {
        if (selectedOptions.length === top100Films.length) {
          return <Chip label="All options" size="small" />;
        }

        const visibleOptions = tagValue.slice(0, visibleTags);
        const hiddenCount = tagValue.length - visibleTags;

        return (
          <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center', flexWrap: 'nowrap' }}>
            {visibleOptions.map((option, index) =>
              typeof option === 'string' ? null : (
                <Chip
                  label={option.title}
                  {...getTagProps({ index })}
                  size="small"
                />
              )
            )}
            {hiddenCount > 0 && (
              <Chip
                label={`+${hiddenCount}`}
                size="small"
                sx={{
                  borderRadius: '16px',
                  height: '24px',
                  minWidth: '24px',
                  padding: '0 6px',
                  backgroundColor: 'rgba(0, 0, 0, 0.08)',
                  color: 'rgba(0, 0, 0, 0.87)',
                  fontWeight: 400,
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.12)'
                  }
                }}
              />
            )}
          </Box>
        );
      }}
      style={{ width: 500 }}
      renderInput={(params) => (
        <TextField
          {...params}
          inputRef={inputRef}
          label="Checkboxes"
          placeholder={selectedOptions.length === 0 ? "Favorites" : ""}
          sx={{
            '& .MuiInputBase-root': {
              minHeight: '56px',
              height: 'auto',
              paddingY: '4px'
            },
            '& .MuiInputBase-input': {
              padding: '0 8px'
            },
            '& .MuiOutlinedInput-root': {
              padding: '4px'
            }
          }}
        />
      )}
    />
  );
}
