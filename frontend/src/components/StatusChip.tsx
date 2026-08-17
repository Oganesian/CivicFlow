import React from 'react';
import { Chip, ChipProps } from '@mui/material';
import { IssueStatus } from '../api/types';

interface StatusChipProps {
  status: IssueStatus;
  size?: 'small' | 'medium';
}

export const StatusChip: React.FC<StatusChipProps> = ({ status, size = 'small' }) => {
  let color: ChipProps['color'] = 'default';
  let label = status.replace('_', ' ');

  switch (status) {
    case 'NEW':
      color = 'info';
      label = 'New';
      break;
    case 'TRIAGED':
      color = 'warning';
      label = 'Triaged';
      break;
    case 'ASSIGNED':
      color = 'primary';
      label = 'Assigned';
      break;
    case 'IN_PROGRESS':
      color = 'secondary';
      label = 'In Progress';
      break;
    case 'RESOLVED':
      color = 'success';
      label = 'Resolved';
      break;
    case 'CLOSED':
      color = 'default';
      label = 'Closed';
      break;
    case 'REJECTED':
      color = 'error';
      label = 'Rejected';
      break;
  }

  return (
    <Chip
      label={label}
      color={color}
      size={size}
      variant={status === 'NEW' || status === 'IN_PROGRESS' ? 'filled' : 'outlined'}
      sx={{
        fontWeight: 600,
        fontSize: size === 'small' ? '0.75rem' : '0.85rem',
      }}
    />
  );
};
