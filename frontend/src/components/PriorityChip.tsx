import React from 'react';
import { Chip } from '@mui/material';
import { Priority } from '../api/types';

interface PriorityChipProps {
  priority: Priority;
  size?: 'small' | 'medium';
}

export const PriorityChip: React.FC<PriorityChipProps> = ({ priority, size = 'small' }) => {
  let bgColor = '#e2e8f0';
  let textColor = '#475569';

  switch (priority) {
    case 'CRITICAL':
      bgColor = '#ffe4e6';
      textColor = '#e11d48';
      break;
    case 'HIGH':
      bgColor = '#ffedd5';
      textColor = '#c2410c';
      break;
    case 'MEDIUM':
      bgColor = '#fef9c3';
      textColor = '#a16207';
      break;
    case 'LOW':
      bgColor = '#f1f5f9';
      textColor = '#64748b';
      break;
  }

  return (
    <Chip
      label={priority}
      size={size}
      sx={{
        backgroundColor: bgColor,
        color: textColor,
        fontWeight: 700,
        fontSize: size === 'small' ? '0.7rem' : '0.8rem',
        border: '1px solid transparent',
      }}
    />
  );
};
