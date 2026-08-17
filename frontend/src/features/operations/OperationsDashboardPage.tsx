import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  LinearProgress,
  Alert,
  Chip,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useQuery } from '@tanstack/react-query';
import { staffApi } from '../../api/client';
import { PriorityChip } from '../../components/PriorityChip';
import { formatDistanceToNow, parseISO } from 'date-fns';

export const OperationsDashboardPage: React.FC = () => {
  const { data: summary, isLoading } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: staffApi.getDashboardSummary,
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!summary) return null;

  return (
    <Container maxWidth="xl" sx={{ py: 5 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} flexWrap="wrap" gap={2}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight={700}>
            Operations Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Live municipal dispatch, triage queues, SLA risk monitoring, and team workloads.
          </Typography>
        </Box>
        <Button
          component={RouterLink}
          to="/operations/queue?status=NEW"
          variant="contained"
          color="warning"
          startIcon={<PendingActionsIcon />}
        >
          Triage New Reports ({summary.newReportsAwaitingTriage})
        </Button>
      </Box>

      {/* SLA Risk Banner */}
      {summary.slaAtRiskCount > 0 && (
        <Alert
          severity="warning"
          icon={<WarningAmberIcon fontSize="inherit" />}
          action={
            <Button component={RouterLink} to="/operations/queue" color="inherit" size="small">
              View Work Queue
            </Button>
          }
          sx={{ mb: 4, borderRadius: 2 }}
        >
          <strong>{summary.slaAtRiskCount} active incident(s)</strong> are approaching or past their resolution SLA target.
        </Alert>
      )}

      {/* Metric Cards Grid */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card variant="outlined" sx={{ borderLeft: '4px solid #f59e0b' }}>
            <CardContent>
              <Typography variant="caption" color="text.secondary" fontWeight={700} textTransform="uppercase">
                Awaiting Triage
              </Typography>
              <Typography variant="h3" fontWeight={800} color="#b45309" my={0.5}>
                {summary.newReportsAwaitingTriage}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Needs dispatcher classification
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card variant="outlined" sx={{ borderLeft: '4px solid #3b82f6' }}>
            <CardContent>
              <Typography variant="caption" color="text.secondary" fontWeight={700} textTransform="uppercase">
                Active Workload
              </Typography>
              <Typography variant="h3" fontWeight={800} color="#1e3a8a" my={0.5}>
                {summary.activeIssuesTotal}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Triaged, assigned & in progress
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card variant="outlined" sx={{ borderLeft: '4px solid #10b981' }}>
            <CardContent>
              <Typography variant="caption" color="text.secondary" fontWeight={700} textTransform="uppercase">
                Resolved (30 Days)
              </Typography>
              <Typography variant="h3" fontWeight={800} color="#047857" my={0.5}>
                {summary.resolvedThisMonth}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Public service requests closed
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card variant="outlined" sx={{ borderLeft: '4px solid #e11d48' }}>
            <CardContent>
              <Typography variant="caption" color="text.secondary" fontWeight={700} textTransform="uppercase">
                SLA At Risk
              </Typography>
              <Typography variant="h3" fontWeight={800} color="#9f1239" my={0.5}>
                {summary.slaAtRiskCount}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Due within &lt; 24 hours
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Operations Split Layout */}
      <Grid container spacing={3}>
        {/* Left: Triage & Incident Queue */}
        <Grid item xs={12} lg={8}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Box>
                <Typography variant="h6" fontWeight={700}>
                  New Reports Awaiting Triage
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Prioritize, categorize, and assign to field teams.
                </Typography>
              </Box>
              <Button
                component={RouterLink}
                to="/operations/queue"
                size="small"
                endIcon={<ArrowForwardIcon />}
              >
                All Issues
              </Button>
            </Box>

            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Reference</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>District</TableCell>
                    <TableCell>Priority</TableCell>
                    <TableCell>Reported</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {summary.recentTriageQueue.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                        No pending reports awaiting triage. Great job!
                      </TableCell>
                    </TableRow>
                  ) : (
                    summary.recentTriageQueue.map((issue) => (
                      <TableRow key={issue.id} hover>
                        <TableCell sx={{ fontFamily: 'monospace', fontWeight: 700 }}>
                          {issue.referenceCode}
                        </TableCell>
                        <TableCell sx={{ maxWidth: 180, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {issue.title}
                        </TableCell>
                        <TableCell>{issue.category.name}</TableCell>
                        <TableCell>{issue.district}</TableCell>
                        <TableCell>
                          <PriorityChip priority={issue.priority} size="small" />
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                          {formatDistanceToNow(parseISO(issue.createdAt), { addSuffix: true })}
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            component={RouterLink}
                            to={`/operations/workspace/${issue.id}`}
                            variant="outlined"
                            size="small"
                            sx={{ fontSize: '0.75rem', py: 0.2 }}
                          >
                            Triage
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Right: Team Workload Distribution */}
        <Grid item xs={12} lg={4}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Workload by Service Team
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" mb={3}>
              Active assigned tasks per municipal department.
            </Typography>

            <Box display="flex" flexDirection="column" gap={2.5}>
              {summary.workloadByTeam.map((team) => {
                const maxVal = Math.max(...summary.workloadByTeam.map((t) => t.activeIssueCount), 5);
                const pct = Math.round((team.activeIssueCount / maxVal) * 100);

                return (
                  <Box key={team.teamName}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                      <Typography variant="body2" fontWeight={600}>
                        {team.teamName}
                      </Typography>
                      <Chip
                        label={`${team.activeIssueCount} active`}
                        size="small"
                        sx={{ height: 20, fontSize: '0.7rem', fontWeight: 700 }}
                      />
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={pct}
                      sx={{ height: 8, borderRadius: 4, bgcolor: '#f1f5f9' }}
                    />
                  </Box>
                );
              })}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};
