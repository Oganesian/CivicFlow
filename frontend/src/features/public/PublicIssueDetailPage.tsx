import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  Divider,
  CircularProgress,
  Alert,
  Card,
} from '@mui/material';
import { useParams, Link as RouterLink } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { useQuery } from '@tanstack/react-query';
import { publicApi } from '../../api/client';
import { StatusChip } from '../../components/StatusChip';
import { PriorityChip } from '../../components/PriorityChip';
import { format, parseISO } from 'date-fns';

export const PublicIssueDetailPage: React.FC = () => {
  const { referenceCode } = useParams<{ referenceCode: string }>();

  const {
    data: issue,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['public-issue', referenceCode],
    queryFn: () => publicApi.getIssueByReference(referenceCode || ''),
    enabled: !!referenceCode,
  });

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !issue) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          Public report with reference <strong>{referenceCode}</strong> could not be found.
        </Alert>
        <Button component={RouterLink} to="/explorer" startIcon={<ArrowBackIcon />}>
          Back to Public Explorer
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      {/* Navigation Breadcrumb */}
      <Box mb={3}>
        <Button
          component={RouterLink}
          to="/explorer"
          startIcon={<ArrowBackIcon />}
          size="small"
          sx={{ color: 'text.secondary' }}
        >
          Back to Issue Explorer
        </Button>
      </Box>

      {/* Main Issue Header Card */}
      <Paper variant="outlined" sx={{ p: { xs: 3, md: 4 }, borderRadius: 3, mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2} flexWrap="wrap" gap={1}>
          <Box>
            <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 800, color: 'text.secondary', fontSize: '0.9rem' }}>
              Tracking Code: {issue.referenceCode}
            </Typography>
            <Typography variant="h4" component="h1" fontWeight={700} sx={{ mt: 0.5, color: '#0f172a' }}>
              {issue.title}
            </Typography>
          </Box>
          <Box display="flex" gap={1} alignItems="center">
            <PriorityChip priority={issue.priority} />
            <StatusChip status={issue.status} size="medium" />
          </Box>
        </Box>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.7 }}>
          {issue.description}
        </Typography>

        <Divider sx={{ my: 2 }} />

        {/* Location & Metadata Row */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Box display="flex" alignItems="center" gap={1}>
              <LocationOnIcon fontSize="small" color="primary" />
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  Location & District
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {issue.locationName} ({issue.district})
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Box display="flex" alignItems="center" gap={1}>
              <CalendarTodayIcon fontSize="small" color="primary" />
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  Reported On
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {format(parseISO(issue.createdAt), 'PPP p')}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Box>
              <Typography variant="caption" color="text.secondary" display="block">
                Category
              </Typography>
              <Chip label={issue.category.name} size="small" variant="outlined" sx={{ fontWeight: 600, mt: 0.2 }} />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Public Status Timeline */}
      <Paper variant="outlined" sx={{ p: { xs: 3, md: 4 }, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Public Resolution Timeline
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={4}>
          Transparent milestone updates recorded by municipal service operations.
        </Typography>

        {issue.publicTimeline && issue.publicTimeline.length > 0 ? (
          <Box sx={{ position: 'relative', pl: 3, borderLeft: '2px solid #e2e8f0', ml: 1.5 }}>
            {issue.publicTimeline.map((item, idx) => (
              <Box key={idx} sx={{ position: 'relative', mb: 4, '&:last-child': { mb: 0 } }}>
                {/* Timeline node icon */}
                <Box
                  sx={{
                    position: 'absolute',
                    left: -33,
                    top: 2,
                    backgroundColor: '#ffffff',
                    color: item.status === 'RESOLVED' || item.status === 'CLOSED' ? '#16a34a' : '#2563eb',
                  }}
                >
                  {item.status === 'RESOLVED' || item.status === 'CLOSED' ? (
                    <CheckCircleIcon sx={{ fontSize: 22 }} />
                  ) : (
                    <RadioButtonCheckedIcon sx={{ fontSize: 20 }} />
                  )}
                </Box>

                <Box display="flex" justifyContent="space-between" alignItems="baseline" mb={0.5} flexWrap="wrap">
                  <Typography variant="subtitle2" fontWeight={700} color="#0f172a">
                    {item.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {format(parseISO(item.timestamp), 'PP p')}
                  </Typography>
                </Box>

                {item.message && (
                  <Card variant="outlined" sx={{ mt: 1, p: 1.5, backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}>
                    <Typography variant="body2" color="text.primary">
                      {item.message}
                    </Typography>
                  </Card>
                )}
              </Box>
            ))}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No public status updates recorded yet.
          </Typography>
        )}
      </Paper>
    </Container>
  );
};
