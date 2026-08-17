import React, { useState } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
  Tabs,
  Tab,
  Alert,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi, staffApi } from '../../api/client';
import { UserRole } from '../../api/types';

export const AdminUsersPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('TECHNICIAN');
  const [teamId, setTeamId] = useState('');

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => adminApi.getAllUsers(),
  });

  const { data: teams } = useQuery({
    queryKey: ['staff-teams'],
    queryFn: staffApi.getActiveTeams,
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => adminApi.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setOpen(false);
      setEmail('');
      setDisplayName('');
      setPassword('');
      setTeamId('');
    },
  });

  return (
    <Container maxWidth="xl" sx={{ py: 5 }}>
      {/* Admin Navigation Tabs */}
      <Box mb={4}>
        <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
          System Administration
        </Typography>
        <Paper variant="outlined" sx={{ borderRadius: 2 }}>
          <Tabs value={2} sx={{ borderBottom: '1px solid #e2e8f0' }}>
            <Tab label="Categories & SLAs" component={RouterLink} to="/admin/categories" />
            <Tab label="Service Teams" component={RouterLink} to="/admin/teams" />
            <Tab label="Staff Users & Roles" component={RouterLink} to="/admin/users" />
          </Tabs>
        </Paper>
      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6" fontWeight={700}>
          Municipal Staff & User Accounts
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<PersonAddIcon />}
          size="small"
          onClick={() => setOpen(true)}
        >
          Add Staff User
        </Button>
      </Box>

      <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
        {isLoading ? (
          <Box display="flex" justifyContent="center" py={8}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Display Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Assigned Team</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users?.map((u) => (
                  <TableRow key={u.id} hover>
                    <TableCell sx={{ fontWeight: 700 }}>{u.displayName}</TableCell>
                    <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{u.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={u.role}
                        size="small"
                        color={u.role === 'ADMIN' ? 'error' : u.role === 'DISPATCHER' ? 'warning' : 'primary'}
                        sx={{ fontWeight: 700 }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>{u.teamName || '—'}</TableCell>
                    <TableCell>
                      <Chip
                        label={u.active ? 'Active' : 'Disabled'}
                        size="small"
                        color={u.active ? 'success' : 'default'}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Dialog to create user */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Add Municipal Staff User</DialogTitle>
        <DialogContent dividers>
          {createMutation.isError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Failed to create staff user.
            </Alert>
          )}

          <TextField
            label="Display Name"
            placeholder="e.g. Sandra Koch"
            fullWidth
            required
            size="small"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            sx={{ mb: 2, mt: 1 }}
          />

          <TextField
            label="Email Address"
            type="email"
            placeholder="sandra.koch@civicflow.app"
            fullWidth
            required
            size="small"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Temporary Password"
            type="password"
            fullWidth
            required
            size="small"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel id="role-select-label">Role *</InputLabel>
            <Select
              labelId="role-select-label"
              value={role}
              label="Role *"
              onChange={(e) => setRole(e.target.value as UserRole)}
            >
              <MenuItem value="DISPATCHER">Dispatcher</MenuItem>
              <MenuItem value="TECHNICIAN">Technician</MenuItem>
              <MenuItem value="ADMIN">Administrator</MenuItem>
              <MenuItem value="RESIDENT">Resident (Observer)</MenuItem>
            </Select>
          </FormControl>

          {role === 'TECHNICIAN' && (
            <FormControl fullWidth size="small">
              <InputLabel id="team-select-label">Assigned Service Team</InputLabel>
              <Select
                labelId="team-select-label"
                value={teamId}
                label="Assigned Service Team"
                onChange={(e) => setTeamId(e.target.value)}
              >
                <MenuItem value="">No Team Assigned</MenuItem>
                {teams?.map((t) => (
                  <MenuItem key={t.id} value={t.id}>
                    {t.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            disabled={!displayName || !email || !password || createMutation.isPending}
            onClick={() =>
              createMutation.mutate({
                displayName: displayName.trim(),
                email: email.trim().toLowerCase(),
                password,
                role,
                teamId: teamId || undefined,
              })
            }
          >
            Create User
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
