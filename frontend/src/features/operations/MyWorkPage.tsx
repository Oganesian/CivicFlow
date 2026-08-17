import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import HandymanIcon from '@mui/icons-material/Handyman';
import { useQuery } from '@tanstack/react-query';
import { staffApi } from '../../api/client';
import { StatusChip } from '../../components/StatusChip';
import { PriorityChip } from '../../components/PriorityChip';
import { SlaBadge } from '../../components/SlaBadge';
import { EmptyState } from '../../components/EmptyState';
import { useAuth } from '../../auth/useAuth';
import { formatDistanceToNow, parseISO } from 'date-fns';

export const MyWorkPage: React.FC = () => {
  const { user } = useAuth();

  const { data: myWorkData, isLoading } = useQuery({
    queryKey: ['my-work'],
    queryFn: () => staffApi.getMyWork({ page: 0, size: 50, sort: 'dueAt,asc' }),
  });

  return (
    <Container maxWidth="xl" sx={{ py: 5 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} flexWrap="wrap" gap={2}>
        <Box>
          <Box display="flex" alignItems="center" gap={1} mb={0.5}>
            <HandymanIcon color="primary" />
            <Typography variant="h4" component="h1" fontWeight={700}>
              My Assigned Work
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Incident queue for <strong>{user?.displayName}</strong> ({user?.teamName || 'Unassigned Department'})
          </Typography>
        </Box>
      </Box>

      {/* Table Data */}
      <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
        {isLoading ? (
          <Box display="flex" justifyContent="center" py={12}>
            <CircularProgress />
          </Box>
        ) : !myWorkData || myWorkData.content.length === 0 ? (
          <EmptyState
            title="No Assigned Incidents"
            description="You have no pending field incidents assigned to you or your service team right now."
          />
        ) : (
          <TableContainer>
            <Table size="medium">
              <TableHead>
                <TableRow>
                  <TableCell>Reference</TableCell>
                  <TableCell>Title & Location</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>SLA Target</TableCell>
                  <TableCell>Last Updated</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {myWorkData.content.map((issue) => (
                  <TableRow key={issue.id} hover>
                    <TableCell sx={{ fontFamily: 'monospace', fontWeight: 700 }}>
                      {issue.referenceCode}
                    </TableCell>
                    <TableCell sx={{ maxWidth: 240 }}>
                      <Typography variant="body2" fontWeight={700} noWrap>
                        {issue.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" noWrap display="block">
                        📍 {issue.district} · {issue.locationName}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.85rem' }}>{issue.category.name}</TableCell>
                    <TableCell>
                      <PriorityChip priority={issue.priority} size="small" />
                    </TableCell>
                    <TableCell>
                      <StatusChip status={issue.status} size="small" />
                    </TableCell>
                    <TableCell>
                      <SlaBadge dueAt={issue.dueAt} resolvedAt={issue.status === 'RESOLVED' ? issue.updatedAt : null} />
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                      {formatDistanceToNow(parseISO(issue.updatedAt), { addSuffix: true })}
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        component={RouterLink}
                        to={`/operations/workspace/${issue.id}`}
                        variant="contained"
                        size="small"
                        color="primary"
                        endIcon={<OpenInNewIcon fontSize="small" />}
                        sx={{ fontSize: '0.75rem', py: 0.4 }}
                      >
                        Open Workspace
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Container>
  );
};
