import React from 'react';
import { Box, Typography } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { formatDistanceToNow, isPast, parseISO } from 'date-fns';

interface SlaBadgeProps {
  dueAt?: string | null;
  resolvedAt?: string | null;
}

export const SlaBadge: React.FC<SlaBadgeProps> = ({ dueAt, resolvedAt }) => {
  if (resolvedAt) {
    return (
      <Box display="inline-flex" alignItems="center" gap={0.5} color="success.main">
        <CheckCircleOutlineIcon fontSize="inherit" sx={{ fontSize: 16 }} />
        <Typography variant="caption" fontWeight={600}>
          Resolved
        </Typography>
      </Box>
    );
  }

  if (!dueAt) {
    return (
      <Typography variant="caption" color="text.secondary">
        No SLA target
      </Typography>
    );
  }

  const dueDate = parseISO(dueAt);
  const isOverdue = isPast(dueDate);

  return (
    <Box
      display="inline-flex"
      alignItems="center"
      gap={0.5}
      sx={{
        px: 1,
        py: 0.25,
        borderRadius: 1,
        backgroundColor: isOverdue ? '#ffe4e6' : '#f0fdf4',
        color: isOverdue ? '#e11d48' : '#166534',
        border: `1px solid ${isOverdue ? '#fecdd3' : '#bbf7d0'}`,
      }}
    >
      {isOverdue ? (
        <WarningAmberIcon fontSize="inherit" sx={{ fontSize: 15 }} />
      ) : (
        <AccessTimeIcon fontSize="inherit" sx={{ fontSize: 15 }} />
      )}
      <Typography variant="caption" fontWeight={700}>
        {isOverdue
          ? `Overdue (${formatDistanceToNow(dueDate, { addSuffix: true })})`
          : `Due ${formatDistanceToNow(dueDate, { addSuffix: true })}`}
      </Typography>
    </Box>
  );
};
