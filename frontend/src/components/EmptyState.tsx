import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  onAction,
}) => {
  return (
    <Box
      textAlign="center"
      py={8}
      px={2}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          backgroundColor: '#f1f5f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'text.secondary',
          mb: 2,
        }}
      >
        <InboxOutlinedIcon sx={{ fontSize: 32 }} />
      </Box>
      <Typography variant="h6" color="text.primary" gutterBottom>
        {title}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        maxWidth={400}
        mb={actionText ? 3 : 0}
      >
        {description}
      </Typography>
      {actionText && onAction && (
        <Button variant="outlined" color="primary" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </Box>
  );
};
