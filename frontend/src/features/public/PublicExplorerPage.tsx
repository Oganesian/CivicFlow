import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  ToggleButton,
  ToggleButtonGroup,
  Pagination,
  CircularProgress,
  Paper,
  Chip,
} from '@mui/material';
import { useSearchParams, Link as RouterLink } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import ViewListIcon from '@mui/icons-material/ViewList';
import MapIcon from '@mui/icons-material/Map';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useQuery } from '@tanstack/react-query';
import { publicApi } from '../../api/client';
import { StatusChip } from '../../components/StatusChip';
import { PriorityChip } from '../../components/PriorityChip';
import { EmptyState } from '../../components/EmptyState';
import { DISTRICTS } from '../../components/districts';
import { IssueStatus } from '../../api/types';
import { asArray } from '../../utils/safeArray';
import { formatDistanceToNow, parseISO } from 'date-fns';

export const PublicExplorerPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  const category = searchParams.get('category') || '';
  const status = (searchParams.get('status') as IssueStatus) || '';
  const district = searchParams.get('district') || '';
  const search = searchParams.get('search') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const { data: categories } = useQuery({
    queryKey: ['public-categories'],
    queryFn: publicApi.getCategories,
  });

  const categoryOptions = asArray(categories);

  const { data: issuesData, isLoading } = useQuery({
    queryKey: ['public-issues', category, status, district, search, page],
    queryFn: () =>
      publicApi.searchIssues({
        category: category || undefined,
        status: status ? (status as IssueStatus) : undefined,
        district: district || undefined,
        search: search || undefined,
        page: page - 1,
        size: 9,
        sort: 'createdAt,desc',
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

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
          Public Issue Explorer
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track active and resolved municipal service requests across all districts with public status updates.
        </Typography>
      </Box>

      {/* Filter Toolbar */}
      <Paper variant="outlined" sx={{ p: 2.5, mb: 4, borderRadius: 2.5, backgroundColor: '#ffffff' }}>
        <Grid container spacing={2} alignItems="center">
          {/* Search bar */}
          <Grid item xs={12} md={4}>
            <TextField
              size="small"
              fullWidth
              placeholder="Search reference, title, or street..."
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

          {/* Category filter */}
          <Grid item xs={6} sm={4} md={2.5}>
            <FormControl fullWidth size="small">
              <InputLabel id="category-filter-label">Category</InputLabel>
              <Select
                labelId="category-filter-label"
                value={category}
                label="Category"
                onChange={(e) => updateParam('category', e.target.value)}
              >
                <MenuItem value="">All Categories</MenuItem>
                {categoryOptions.map((cat) => (
                  <MenuItem key={cat.id} value={cat.slug}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* District filter */}
          <Grid item xs={6} sm={4} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel id="district-filter-label">District</InputLabel>
              <Select
                labelId="district-filter-label"
                value={district}
                label="District"
                onChange={(e) => updateParam('district', e.target.value)}
              >
                <MenuItem value="">All Districts</MenuItem>
                {DISTRICTS.map((d) => (
                  <MenuItem key={d} value={d}>
                    {d}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Status filter */}
          <Grid item xs={6} sm={4} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel id="status-filter-label">Status</InputLabel>
              <Select
                labelId="status-filter-label"
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
              </Select>
            </FormControl>
          </Grid>

          {/* View toggle */}
          <Grid item xs={6} md={1.5} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <ToggleButtonGroup
              size="small"
              value={viewMode}
              exclusive
              onChange={(_, val) => val && setViewMode(val)}
            >
              <ToggleButton value="list" aria-label="list view">
                <ViewListIcon fontSize="small" />
              </ToggleButton>
              <ToggleButton value="map" aria-label="map view">
                <MapIcon fontSize="small" />
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>
        </Grid>
      </Paper>

      {/* Results Content */}
      {isLoading ? (
        <Box display="flex" justifyContent="center" py={12}>
          <CircularProgress />
        </Box>
      ) : !issuesData || issues.length === 0 ? (
        <EmptyState
          title="No Issues Found"
          description="There are no public reports matching your current filter criteria."
          actionText="Clear Filters"
          onAction={() => setSearchParams(new URLSearchParams())}
        />
      ) : viewMode === 'list' ? (
        <>
          <Grid container spacing={3}>
            {issues.map((issue) => (
              <Grid item xs={12} sm={6} md={4} key={issue.referenceCode}>
                <Card
                  component={RouterLink}
                  to={`/issues/${issue.referenceCode}`}
                  sx={{
                    height: '100%',
                    textDecoration: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                      borderColor: '#93c5fd',
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
                      <Chip
                        label={issue.referenceCode}
                        size="small"
                        sx={{ fontFamily: 'monospace', fontWeight: 700, bgcolor: '#f1f5f9' }}
                      />
                      <StatusChip status={issue.status} />
                    </Box>

                    <Typography variant="h6" fontWeight={700} color="text.primary" gutterBottom>
                      {issue.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        flexGrow: 1,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {issue.description}
                    </Typography>

                    <Box display="flex" gap={1} mb={2} flexWrap="wrap">
                      <Chip
                        label={issue.category.name}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.75rem' }}
                      />
                      <PriorityChip priority={issue.priority} size="small" />
                    </Box>

                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mt="auto"
                      pt={1.5}
                      borderTop="1px solid #f1f5f9"
                    >
                      <Typography variant="caption" color="text.secondary" fontWeight={600}>
                        📍 {issue.district} · {issue.locationName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDistanceToNow(parseISO(issue.createdAt), { addSuffix: true })}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {issuesData.totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={6}>
              <Pagination
                count={issuesData.totalPages}
                page={page}
                onChange={(_, val) => {
                  const newParams = new URLSearchParams(searchParams);
                  newParams.set('page', val.toString());
                  setSearchParams(newParams);
                }}
                color="primary"
              />
            </Box>
          )}
        </>
      ) : (
        /* Map View */
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, backgroundColor: '#f8fafc' }}>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <LocationOnIcon color="primary" />
            <Typography variant="subtitle1" fontWeight={700}>
              District Geographical Distribution
            </Typography>
          </Box>
          <Box
            sx={{
              height: 420,
              backgroundColor: '#e2e8f0',
              borderRadius: 2,
              position: 'relative',
              overflow: 'hidden',
              backgroundImage: `
                radial-gradient(#94a3b8 1px, transparent 1px),
                linear-gradient(to right, #e2e8f0 1px, transparent 1px),
                linear-gradient(to bottom, #e2e8f0 1px, #f1f5f9 1px)
              `,
              backgroundSize: '24px 24px, 48px 48px, 48px 48px',
            }}
          >
            {issues.map((issue, idx) => {
              // Distribute pins visibly across districts on map
              const offsets = [
                { top: '30%', left: '48%' },
                { top: '20%', left: '35%' },
                { top: '45%', left: '25%' },
                { top: '55%', left: '65%' },
                { top: '70%', left: '45%' },
              ];
              const pos = offsets[idx % offsets.length];

              return (
                <Box
                  key={issue.referenceCode}
                  component={RouterLink}
                  to={`/issues/${issue.referenceCode}`}
                  sx={{
                    position: 'absolute',
                    top: pos.top,
                    left: pos.left,
                    transform: 'translate(-50%, -50%)',
                    textDecoration: 'none',
                    textAlign: 'center',
                    cursor: 'pointer',
                    '&:hover .pin-badge': {
                      transform: 'scale(1.1)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                    },
                  }}
                >
                  <Paper
                    className="pin-badge"
                    elevation={3}
                    sx={{
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.8,
                      transition: 'all 0.15s ease',
                      border: '2px solid #1e3a8a',
                    }}
                  >
                    <LocationOnIcon fontSize="small" sx={{ color: '#e11d48' }} />
                    <Typography variant="caption" fontWeight={700} color="#0f172a">
                      {issue.referenceCode} ({issue.district})
                    </Typography>
                  </Paper>
                </Box>
              );
            })}
          </Box>
        </Paper>
      )}
    </Container>
  );
};
