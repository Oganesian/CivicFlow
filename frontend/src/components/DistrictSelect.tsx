import React from 'react';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { DISTRICTS } from './districts';

interface DistrictSelectProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  label?: string;
  allowAll?: boolean;
}

export const DistrictSelect: React.FC<DistrictSelectProps> = ({
  value,
  onChange,
  required = false,
  label = 'Municipal District',
  allowAll = false,
}) => {
  const handleChange = (e: SelectChangeEvent) => {
    onChange(e.target.value);
  };

  return (
    <FormControl fullWidth size="small">
      <InputLabel id="district-select-label">{label}</InputLabel>
      <Select
        labelId="district-select-label"
        value={value}
        label={label}
        required={required}
        onChange={handleChange}
      >
        {allowAll && <MenuItem value="">All Districts</MenuItem>}
        {DISTRICTS.map((d) => (
          <MenuItem key={d} value={d}>
            {d}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
