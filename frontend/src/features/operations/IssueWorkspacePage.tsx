import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Tab,
  Tabs,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import { useParams, Link as RouterLink } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import SendIcon from '@mui/icons-material/Send';
import HistoryIcon from '@mui/icons-material/History';
import CommentIcon from '@mui/icons-material/Comment';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PublicIcon from '@mui/icons-material/Public';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { staffApi, adminApi } from '../../api/client';
import { StatusChip } from '../../components/StatusChip';
import { PriorityChip } from '../../components/PriorityChip';
import { SlaBadge } from '../../components/SlaBadge';
import { useAuth } from '../../auth/useAuth';
import { IssueStatus, Priority, CommentVisibility } from '../../api/types';
import { format, parseISO } from 'date-fns';

export const IssueWorkspacePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<0 | 1>(0);

  // Status transition dialog state
  const [transitionOpen, setTransitionOpen] = useState(false);
  const [targetStatus, setTargetStatus] = useState<IssueStatus>('TRIAGED');
  const [publicMessage, setPublicMessage] = useState('');
  const [internalMessage, setInternalMessage] = useState('');

  // Assignment dialog state
  const [assignOpen, setAssignOpen] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');

  // Priority edit dialog state
  const [priorityOpen, setPriorityOpen] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState<Priority>('MEDIUM');

  // New comment state
  const [newCommentBody, setNewCommentBody] = useState('');
  const [newCommentVisibility, setNewCommentVisibility] = useState<CommentVisibility>('INTERNAL');

  const {
    data: issue,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['staff-issue-detail', id],
    queryFn: () => staffApi.getIssueDetail(id || ''),
    enabled: !!id,
  });

  const { data: teams } = useQuery({
    queryKey: ['staff-teams'],
    queryFn: staffApi.getActiveTeams,
  });

  const { data: teamUsers } = useQuery({
    queryKey: ['team-users', selectedTeamId],
    queryFn: () => adminApi.getAllUsers(selectedTeamId || undefined),
    enabled: !!selectedTeamId,
  });

  // Mutations
  const transitionMutation = useMutation({
    mutationFn: (data: { status: IssueStatus; publicMessage?: string; internalMessage?: string }) =>
      staffApi.transitionStatus(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-issue-detail', id] });
      setTransitionOpen(false);
      setPublicMessage('');
      setInternalMessage('');
    },
  });

  const assignMutation = useMutation({
    mutationFn: (data: { teamId: string; userId?: string | null }) =>
      staffApi.assignIssue(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-issue-detail', id] });
      setAssignOpen(false);
    },
  });

  const priorityMutation = useMutation({
    mutationFn: (newPriority: Priority) =>
      staffApi.updateIssue(id!, { priority: newPriority }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-issue-detail', id] });
      setPriorityOpen(false);
    },
  });

  const commentMutation = useMutation({
    mutationFn: (data: { body: string; visibility: CommentVisibility }) =>
      staffApi.addComment(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-issue-detail', id] });
      setNewCommentBody('');
    },
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
        <Alert severity="error" sx={{ mb: 3 }}>
          Could not load incident details. Please check the ID and try again.
        </Alert>
        <Button component={RouterLink} to="/operations/queue" startIcon={<ArrowBackIcon />}>
          Back to Work Queue
        </Button>
      </Container>
    );
  }

  // Calculate valid next statuses based on current status
  const getAvailableNextStatuses = (current: IssueStatus): IssueStatus[] => {
    switch (current) {
      case 'NEW':
        return ['TRIAGED', 'REJECTED'];
      case 'TRIAGED':
        return ['ASSIGNED', 'IN_PROGRESS', 'REJECTED'];
      case 'ASSIGNED':
        return ['IN_PROGRESS', 'TRIAGED', 'REJECTED'];
      case 'IN_PROGRESS':
        return ['RESOLVED', 'ASSIGNED', 'TRIAGED'];
      case 'RESOLVED':
        return ['CLOSED', 'IN_PROGRESS'];
      case 'CLOSED':
      case 'REJECTED':
      default:
        return [];
    }
  };

  const nextStatuses = getAvailableNextStatuses(issue.status);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Top Breadcrumb & Action Bar */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
        <Button
          component={RouterLink}
          to="/operations/queue"
          startIcon={<ArrowBackIcon />}
          size="small"
          sx={{ color: 'text.secondary' }}
        >
          Back to Work Queue
        </Button>

        {/* Operational Workflow Action Buttons */}
        <Box display="flex" gap={1.5} flexWrap="wrap">
          {user?.role !== 'RESIDENT' && (
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                setSelectedPriority(issue.priority);
                setPriorityOpen(true);
              }}
            >
              Change Priority
            </Button>
          )}

          {(user?.role === 'DISPATCHER' || user?.role === 'ADMIN') && (
            <Button
              variant="outlined"
              color="primary"
              size="small"
              startIcon={<GroupAddIcon />}
              onClick={() => {
                setSelectedTeamId(issue.assignedTeamId || '');
                setSelectedUserId(issue.assignedUserId || '');
                setAssignOpen(true);
              }}
            >
              Assign Team / Tech
            </Button>
          )}

          {nextStatuses.length > 0 && (
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<SwapHorizIcon />}
              onClick={() => {
                setTargetStatus(nextStatuses[0]);
                setTransitionOpen(true);
              }}
            >
              Update Status
            </Button>
          )}
        </Box>
      </Box>

      {/* Main Grid: Left details & actions, Right comments & audit log */}
      <Grid container spacing={3}>
        {/* Left Column: Issue Metadata */}
        <Grid item xs={12} lg={7}>
          <Paper variant="outlined" sx={{ p: 3.5, borderRadius: 3, mb: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2} flexWrap="wrap" gap={1}>
              <Box>
                <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 800, color: 'text.secondary' }}>
                  {issue.referenceCode} · Version #{issue.version}
                </Typography>
                <Typography variant="h5" component="h1" fontWeight={700} sx={{ mt: 0.5 }}>
                  {issue.title}
                </Typography>
              </Box>
              <Box display="flex" gap={1} alignItems="center">
                <PriorityChip priority={issue.priority} />
                <StatusChip status={issue.status} size="medium" />
              </Box>
            </Box>

            <Typography variant="body1" color="text.primary" sx={{ mb: 3, lineHeight: 1.7 }}>
              {issue.description}
            </Typography>

            <Divider sx={{ my: 2.5 }} />

            {/* Operational Details Grid */}
            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary" display="block">
                  Category & District
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {issue.category.name} · {issue.district}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary" display="block">
                  Location Name
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {issue.locationName}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary" display="block">
                  Assigned Team & Technician
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {issue.assignedTeamName ? `${issue.assignedTeamName} ` : 'Unassigned'}
                  {issue.assignedUserName && `(Tech: ${issue.assignedUserName})`}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary" display="block">
                  SLA Target & Status
                </Typography>
                <SlaBadge dueAt={issue.dueAt} resolvedAt={issue.resolvedAt} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary" display="block">
                  Reported On
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {format(parseISO(issue.createdAt), 'PPP p')}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary" display="block">
                  Reporter Email (Internal Confidential)
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                  {issue.reporterEmail || 'Not provided'}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* New Comment Composer */}
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>
              Add Operational Update or Internal Note
            </Typography>

            {commentMutation.isError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                Failed to add comment.
              </Alert>
            )}

            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Write comment or progress update..."
              value={newCommentBody}
              onChange={(e) => setNewCommentBody(e.target.value)}
              size="small"
              sx={{ mb: 2 }}
            />

            <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
              <RadioGroup
                row
                value={newCommentVisibility}
                onChange={(e) => setNewCommentVisibility(e.target.value as CommentVisibility)}
              >
                <FormControlLabel
                  value="INTERNAL"
                  control={<Radio size="small" />}
                  label={
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <LockOutlinedIcon fontSize="inherit" color="action" />
                      <Typography variant="caption" fontWeight={600}>
                        Internal Note (Staff only)
                      </Typography>
                    </Box>
                  }
                />
                <FormControlLabel
                  value="PUBLIC"
                  control={<Radio size="small" />}
                  label={
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <PublicIcon fontSize="inherit" color="primary" />
                      <Typography variant="caption" fontWeight={600}>
                        Public Update (Visible to Citizen)
                      </Typography>
                    </Box>
                  }
                />
              </RadioGroup>

              <Button
                variant="contained"
                color="primary"
                size="small"
                disabled={!newCommentBody.trim() || commentMutation.isPending}
                startIcon={<SendIcon />}
                onClick={() =>
                  commentMutation.mutate({
                    body: newCommentBody,
                    visibility: newCommentVisibility,
                  })
                }
              >
                Post Comment
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Right Column: Tabbed Comments & Audit Trail */}
        <Grid item xs={12} lg={5}>
          <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <Tabs
              value={activeTab}
              onChange={(_, val) => setActiveTab(val)}
              variant="fullWidth"
              sx={{ borderBottom: '1px solid #e2e8f0' }}
            >
              <Tab icon={<CommentIcon fontSize="small" />} iconPosition="start" label={`Comments (${issue.comments.length})`} />
              <Tab icon={<HistoryIcon fontSize="small" />} iconPosition="start" label={`Audit Trail (${issue.events.length})`} />
            </Tabs>

            <Box sx={{ p: 3, maxHeight: 600, overflowY: 'auto' }}>
              {activeTab === 0 ? (
                /* Comments List */
                issue.comments.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
                    No comments added yet.
                  </Typography>
                ) : (
                  <Box display="flex" flexDirection="column" gap={2}>
                    {issue.comments.map((comment) => (
                      <Card
                        key={comment.id}
                        variant="outlined"
                        sx={{
                          borderColor: comment.visibility === 'PUBLIC' ? '#93c5fd' : '#e2e8f0',
                          backgroundColor: comment.visibility === 'PUBLIC' ? '#f0f9ff' : '#ffffff',
                        }}
                      >
                        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                            <Box display="flex" alignItems="center" gap={1}>
                              <Typography variant="subtitle2" fontWeight={700}>
                                {comment.authorName}
                              </Typography>
                              <Chip
                                label={comment.visibility}
                                size="small"
                                color={comment.visibility === 'PUBLIC' ? 'primary' : 'default'}
                                sx={{ height: 18, fontSize: '0.65rem', fontWeight: 700 }}
                              />
                            </Box>
                            <Typography variant="caption" color="text.secondary">
                              {format(parseISO(comment.createdAt), 'p · d MMM')}
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="text.primary">
                            {comment.body}
                          </Typography>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                )
              ) : (
                /* Audit Trail / Events List */
                issue.events.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
                    No audit events recorded.
                  </Typography>
                ) : (
                  <Box display="flex" flexDirection="column" gap={2}>
                    {issue.events.map((event) => (
                      <Paper key={event.id} variant="outlined" sx={{ p: 1.5, backgroundColor: '#f8fafc' }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                          <Chip
                            label={event.eventType}
                            size="small"
                            sx={{ height: 20, fontSize: '0.7rem', fontWeight: 700, bgcolor: '#1e293b', color: '#ffffff' }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {format(parseISO(event.createdAt), 'p · d MMM')}
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Actor: <strong>{event.actorName}</strong>
                        </Typography>
                        {event.previousValue && event.newValue && (
                          <Typography variant="caption" color="text.primary" sx={{ fontFamily: 'monospace', display: 'block', mt: 0.5 }}>
                            {event.previousValue} → {event.newValue}
                          </Typography>
                        )}
                      </Paper>
                    ))}
                  </Box>
                )
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Dialog: Status Transition */}
      <Dialog open={transitionOpen} onClose={() => setTransitionOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Advance Issue Status</DialogTitle>
        <DialogContent dividers>
          {transitionMutation.isError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {(transitionMutation.error as any)?.response?.data?.detail || 'Failed to transition status.'}
            </Alert>
          )}

          <FormControl fullWidth size="small" sx={{ mb: 2.5, mt: 1 }}>
            <InputLabel id="target-status-label">Target Status *</InputLabel>
            <Select
              labelId="target-status-label"
              value={targetStatus}
              label="Target Status *"
              onChange={(e) => setTargetStatus(e.target.value as IssueStatus)}
            >
              {nextStatuses.map((st) => (
                <MenuItem key={st} value={st}>
                  {st.replace('_', ' ')}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {targetStatus === 'RESOLVED' && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Resolving an issue requires a public explanation message for citizens.
            </Alert>
          )}

          <TextField
            label="Public Citizen Message"
            placeholder="Explain the update shown to the reporting resident..."
            fullWidth
            multiline
            rows={2}
            size="small"
            value={publicMessage}
            onChange={(e) => setPublicMessage(e.target.value)}
            required={targetStatus === 'RESOLVED'}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Internal Staff Note (Optional)"
            placeholder="Internal operational handover details..."
            fullWidth
            multiline
            rows={2}
            size="small"
            value={internalMessage}
            onChange={(e) => setInternalMessage(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setTransitionOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            disabled={
              transitionMutation.isPending ||
              (targetStatus === 'RESOLVED' && !publicMessage.trim())
            }
            onClick={() =>
              transitionMutation.mutate({
                status: targetStatus,
                publicMessage: publicMessage.trim() || undefined,
                internalMessage: internalMessage.trim() || undefined,
              })
            }
          >
            Confirm Status Transition
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog: Team & Tech Assignment */}
      <Dialog open={assignOpen} onClose={() => setAssignOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Assign Service Team & Field Technician</DialogTitle>
        <DialogContent dividers>
          {assignMutation.isError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Failed to assign issue.
            </Alert>
          )}

          <FormControl fullWidth size="small" sx={{ mb: 2.5, mt: 1 }}>
            <InputLabel id="assign-team-label">Municipal Service Team *</InputLabel>
            <Select
              labelId="assign-team-label"
              value={selectedTeamId}
              label="Municipal Service Team *"
              onChange={(e) => {
                setSelectedTeamId(e.target.value);
                setSelectedUserId('');
              }}
            >
              {teams?.map((t) => (
                <MenuItem key={t.id} value={t.id}>
                  {t.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small" disabled={!selectedTeamId}>
            <InputLabel id="assign-user-label">Specific Field Technician (Optional)</InputLabel>
            <Select
              labelId="assign-user-label"
              value={selectedUserId}
              label="Specific Field Technician (Optional)"
              onChange={(e) => setSelectedUserId(e.target.value)}
            >
              <MenuItem value="">Unassigned (Team Queue)</MenuItem>
              {teamUsers?.map((u) => (
                <MenuItem key={u.id} value={u.id}>
                  {u.displayName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setAssignOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            disabled={!selectedTeamId || assignMutation.isPending}
            onClick={() =>
              assignMutation.mutate({
                teamId: selectedTeamId,
                userId: selectedUserId || null,
              })
            }
          >
            Confirm Assignment
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog: Priority Edit */}
      <Dialog open={priorityOpen} onClose={() => setPriorityOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Set Priority Level</DialogTitle>
        <DialogContent dividers>
          <FormControl fullWidth size="small" sx={{ mt: 1 }}>
            <InputLabel id="select-priority-label">Priority</InputLabel>
            <Select
              labelId="select-priority-label"
              value={selectedPriority}
              label="Priority"
              onChange={(e) => setSelectedPriority(e.target.value as Priority)}
            >
              <MenuItem value="CRITICAL">Critical</MenuItem>
              <MenuItem value="HIGH">High</MenuItem>
              <MenuItem value="MEDIUM">Medium</MenuItem>
              <MenuItem value="LOW">Low</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setPriorityOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            disabled={priorityMutation.isPending}
            onClick={() => priorityMutation.mutate(selectedPriority)}
          >
            Update Priority
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
