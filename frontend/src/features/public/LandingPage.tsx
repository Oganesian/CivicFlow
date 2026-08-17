import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Paper,
  CircularProgress,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import SpeedOutlinedIcon from '@mui/icons-material/SpeedOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useQuery } from '@tanstack/react-query';
import { publicApi } from '../../api/client';
import { StatusChip } from '../../components/StatusChip';
import { formatDistanceToNow, parseISO } from 'date-fns';

export const LandingPage: React.FC = () => {
  const { data: recentIssues, isLoading } = useQuery({
    queryKey: ['public-recent-issues'],
    queryFn: () => publicApi.searchIssues({ page: 0, size: 4, sort: 'createdAt,desc' }),
  });

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
          color: '#ffffff',
          pt: { xs: 8, md: 12 },
          pb: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Chip
                label="City Operations & Incident Management"
                color="secondary"
                size="small"
                sx={{ mb: 2, fontWeight: 700, px: 1 }}
              />
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '2.4rem', md: '3.6rem' },
                  lineHeight: 1.15,
                  mb: 2.5,
                  letterSpacing: '-0.03em',
                }}
              >
                Municipal issue reporting,{' '}
                <Box component="span" sx={{ color: '#38bdf8' }}>
                  auditable resolution.
                </Box>
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: '1rem', md: '1.2rem' },
                  color: '#94a3b8',
                  mb: 4,
                  lineHeight: 1.6,
                  maxWidth: 560,
                }}
              >
                CivicFlow connects citizens directly to municipal service operations.
                Report street damage, broken lights, and park hazards, then track real-time resolution timelines with complete public transparency.
              </Typography>
              <Box display="flex" gap={2} flexWrap="wrap">
                <Button
                  component={RouterLink}
                  to="/report"
                  variant="contained"
                  color="secondary"
                  size="large"
                  startIcon={<AddCircleOutlineIcon />}
                  sx={{ px: 3.5, py: 1.4, fontSize: '1rem', fontWeight: 700 }}
                >
                  Report an Issue
                </Button>
                <Button
                  component={RouterLink}
                  to="/explorer"
                  variant="outlined"
                  size="large"
                  startIcon={<ExploreOutlinedIcon />}
                  sx={{
                    px: 3,
                    py: 1.4,
                    fontSize: '1rem',
                    color: '#ffffff',
                    borderColor: 'rgba(255,255,255,0.3)',
                    '&:hover': { borderColor: '#ffffff', backgroundColor: 'rgba(255,255,255,0.05)' },
                  }}
                >
                  Explore Public Issues
                </Button>
              </Box>
            </Grid>

            {/* Quick Metrics Card */}
            <Grid item xs={12} md={5}>
              <Paper
                elevation={0}
                sx={{
                  p: 3.5,
                  borderRadius: 3,
                  backgroundColor: 'rgba(255, 255, 255, 0.07)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#ffffff',
                }}
              >
                <Typography variant="subtitle2" sx={{ color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.05em', mb: 2 }}>
                  Live Operations Metrics
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="h3" fontWeight={800} color="#ffffff">
                      100%
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                      Auditable History
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="h3" fontWeight={800} color="#34d399">
                      &lt; 24h
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                      Average Triage Time
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="h3" fontWeight={800} color="#fbbf24">
                      5
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                      City Districts
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="h3" fontWeight={800} color="#ffffff">
                      0
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                      Data Leaks (Safe DTOs)
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Feature Highlights */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box textAlign="center" mb={6}>
          <Typography variant="h4" gutterBottom fontWeight={700}>
            Built for Transparency and Operational Speed
          </Typography>
          <Typography variant="body1" color="text.secondary" maxWidth={600} mx="auto">
            From initial citizen report to dispatcher triage and field resolution, every step follows strict domain invariants.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', p: 1 }}>
              <CardContent>
                <Box sx={{ color: '#2563eb', mb: 2 }}>
                  <VisibilityOutlinedIcon sx={{ fontSize: 36 }} />
                </Box>
                <Typography variant="h6" gutterBottom fontWeight={700}>
                  Public-Safe Transparency
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Residents follow live issue status timelines by unique reference codes (e.g. <code>CF-2026-00101</code>) without exposing citizen emails or internal staff notes.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', p: 1 }}>
              <CardContent>
                <Box sx={{ color: '#0d9488', mb: 2 }}>
                  <SpeedOutlinedIcon sx={{ fontSize: 36 }} />
                </Box>
                <Typography variant="h6" gutterBottom fontWeight={700}>
                  Role-Based Workflows
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Dedicated consoles for Dispatchers (triage and priority), Technicians (assigned work and resolution notes), and Administrators (categories and teams).
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', p: 1 }}>
              <CardContent>
                <Box sx={{ color: '#e11d48', mb: 2 }}>
                  <SecurityOutlinedIcon sx={{ fontSize: 36 }} />
                </Box>
                <Typography variant="h6" gutterBottom fontWeight={700}>
                  Append-Only Audit Trail
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Every state transition, priority change, and team assignment is immutably logged with actor references and timestamps.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Recent Public Updates Section */}
      <Box sx={{ backgroundColor: '#f1f5f9', py: 8 }}>
        <Container maxWidth="lg">
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <Box>
              <Typography variant="h5" fontWeight={700}>
                Recent Public Incidents & Updates
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Latest service requests registered across municipal districts.
              </Typography>
            </Box>
            <Button
              component={RouterLink}
              to="/explorer"
              endIcon={<ArrowForwardIcon />}
              color="primary"
              sx={{ fontWeight: 600 }}
            >
              View all issues
            </Button>
          </Box>

          {isLoading ? (
            <Box display="flex" justifyContent="center" py={6}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={3}>
              {recentIssues?.content.map((issue) => (
                <Grid item xs={12} sm={6} md={3} key={issue.referenceCode}>
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
                        boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
                      },
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 700, color: 'text.secondary' }}>
                          {issue.referenceCode}
                        </Typography>
                        <StatusChip status={issue.status} size="small" />
                      </Box>
                      <Typography variant="subtitle1" fontWeight={700} color="text.primary" gutterBottom noWrap>
                        {issue.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {issue.description}
                      </Typography>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mt="auto" pt={1} borderTop="1px solid #f1f5f9">
                        <Typography variant="caption" color="text.secondary" fontWeight={500}>
                          📍 {issue.district}
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
          )}
        </Container>
      </Box>
    </Box>
  );
};
