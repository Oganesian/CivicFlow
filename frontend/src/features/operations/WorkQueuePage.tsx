import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  InputAdornment,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination,
  Button,
  CircularProgress,
  IconButton,
  Chip,
} from '@mui/material';
import { useSearchParams, Link as RouterLink } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import { useQuery } from '@tanstack/react-query';
import { staffApi } from '../../api/client';
import { StatusChip } from '../../components/StatusChip';
import { PriorityChip } from '../../components/PriorityChip';
import { SlaBadge } from '../../components/SlaBadge';
import { EmptyState } from '../../components/EmptyState';
import { DISTRICTS } from '../../components/districts';
import { IssueStatus, Priority } from '../../api/types';
import { asArray } from '../../utils/safeArray';
import { formatDistanceToNow, parseISO } from 'date-fns';

export const WorkQueuePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const status = (searchParams.get('status') as IssueStatus) || '';
  const priority = (searchParams.get('priority') as Priority) || '';
  const teamId = searchParams.get('teamId') || '';
  const district = searchParams.get('district') || '';
  const search = searchParams.get('search') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const { data: teams } = useQuery({
    queryKey: ['staff-teams'],
    queryFn: staffApi.getActiveTeams,
  });

  const { data: issuesData, isLoading } = useQuery({
    queryKey: ['staff-issues', status, priority, teamId, district, search, page],
    queryFn: () =>
      staffApi.searchIssues({
        status: status || undefined,
        priority: priority || undefined,
        teamId: teamId || undefined,
        district: district || undefined,
        search: search || undefined,
        page: page - 1,
        size: 15,
        sort: 'updatedAt,desc',
      }),
  });

  const issues = asArray(issuesData?.content);

  const updateParam = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  return (
    <Container maxWidth="xl" sx={{ py: 5 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} flexWrap="wrap" gap={2}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight={700}>
            Issue Work Queue
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Operational triage, multi-criteria filtering, SLA tracking, and team assignment management.
          </Typography>
        </Box>
      </Box>

      {/* Filter Bar */}
      <Paper variant="outlined" sx={{ p: 2.5, mb: 4, borderRadius: 2.5, backgroundColor: '#ffffff' }}>
        <Grid container spacing={2} alignItems="center">
          {/* Search */}
          <Grid item xs={12} md={3}>
            <TextField
              size="small"
              fullWidth
              placeholder="Search reference, title, location..."
              value={search}
              onChange={(e) => updateParam('search', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Status */}
          <Grid item xs={6} sm={3} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                value={status}
                label="Status"
                onChange={(e) => updateParam('status', e.target.value)}
              >
                <MenuItem value="">All Statuses</MenuItem>
                <MenuItem value="NEW">New</MenuItem>
                <MenuItem value="TRIAGED">Triaged</MenuItem>
                <MenuItem value="ASSIGNED">Assigned</MenuItem>
                <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                <MenuItem value="RESOLVED">Resolved</MenuItem>
                <MenuItem value="CLOSED">Closed</MenuItem>
                <MenuItem value="REJECTED">Rejected</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Priority */}
          <Grid item xs={6} sm={3} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel id="priority-label">Priority</InputLabel>
              <Select
                labelId="priority-label"
                value={priority}
                label="Priority"
                onChange={(e) => updateParam('priority', e.target.value)}
              >
                <MenuItem value="">All Priorities</MenuItem>
                <MenuItem value="CRITICAL">Critical</MenuItem>
                <MenuItem value="HIGH">High</MenuItem>
                <MenuItem value="MEDIUM">Medium</MenuItem>
                <MenuItem value="LOW">Low</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Assigned Team */}
          <Grid item xs={6} sm={3} md={2.5}>
            <FormControl fullWidth size="small">
              <InputLabel id="team-label">Assigned Team</InputLabel>
              <Select
                labelId="team-label"
                value={teamId}
                label="Assigned Team"
                onChange={(e) => updateParam('teamId', e.target.value)}
              >
                <MenuItem value="">All Teams</MenuItem>
                {teams?.map((t) => (
                  <MenuItem key={t.id} value={t.id}>
                    {t.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* District */}
          <Grid item xs={6} sm={3} md={1.5}>
            <FormControl fullWidth size="small">
              <InputLabel id="district-label">District</InputLabel>
              <Select
                labelId="district-label"
                value={district}
                label="District"
                onChange={(e) => updateParam('district', e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                {DISTRICTS.map((d) => (
                  <MenuItem key={d} value={d}>
                    {d}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Clear Filters */}
          <Grid item xs={12} md={1} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton onClick={clearFilters} title="Clear Filters" size="small">
              <FilterListOffIcon fontSize="small" />
            </IconButton>
          </Grid>
        </Grid>
      </Paper>

      {/* Table Data */}
      <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
        {isLoading ? (
          <Box display="flex" justifyContent="center" py={12}>
            <CircularProgress />
          </Box>
        ) : !issuesData || issues.length === 0 ? (
          <EmptyState
            title="No Incidents Match Filter"
            description="Adjust your search parameters or clear filters to view all issues in the work queue."
            actionText="Clear All Filters"
            onAction={clearFilters}
          />
        ) : (
          <>
            <TableContainer>
              <Table size="medium">
                <TableHead>
                  <TableRow>
                    <TableCell>Reference</TableCell>
                    <TableCell>Title & Location</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Priority</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Assigned Team / Tech</TableCell>
                    <TableCell>SLA Target</TableCell>
                    <TableCell>Updated</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {issues.map((issue) => (
                    <TableRow key={issue.id} hover>
                      <TableCell sx={{ fontFamily: 'monospace', fontWeight: 700 }}>
                        {issue.referenceCode}
                      </TableCell>
                      <TableCell sx={{ maxWidth: 220 }}>
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
                        {issue.assignedTeamName ? (
                          <Box>
                            <Typography variant="body2" fontWeight={600}>
                              {issue.assignedTeamName}
                            </Typography>
                            {issue.assignedUserName && (
                              <Typography variant="caption" color="text.secondary" display="block">
                                👤 {issue.assignedUserName}
                              </Typography>
                            )}
                          </Box>
                        ) : (
                          <Chip label="Unassigned" size="small" variant="outlined" sx={{ color: 'text.secondary' }} />
                        )}
                      </TableCell>
                      <TableCell>
                        <SlaBadge dueAt={issue.dueAt} />
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
                          Workspace
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination Footer */}
            {issuesData.totalPages > 1 && (
              <Box display="flex" justifyContent="space-between" alignItems="center" p={2} borderTop="1px solid #e2e8f0">
                <Typography variant="caption" color="text.secondary">
                  Showing {issuesData.content.length} of {issuesData.totalElements} incidents
                </Typography>
                <Pagination
                  count={issuesData.totalPages}
                  page={page}
                  onChange={(_, val) => {
                    const newParams = new URLSearchParams(searchParams);
                    newParams.set('page', val.toString());
                    setSearchParams(newParams);
                  }}
                  color="primary"
                  size="small"
                />
              </Box>
            )}
          </>
        )}
      </Paper>
    </Container>
  );
};
