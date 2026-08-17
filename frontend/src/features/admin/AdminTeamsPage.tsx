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
  Chip,
  Tabs,
  Tab,
  Alert,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../api/client';
import { Team } from '../../api/types';

export const AdminTeamsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const { data: teams, isLoading } = useQuery({
    queryKey: ['admin-teams'],
    queryFn: adminApi.getAllTeams,
  });

  const createMutation = useMutation({
    mutationFn: (data: Partial<Team>) => adminApi.createTeam(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-teams'] });
      setOpen(false);
      setName('');
      setDescription('');
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
          <Tabs value={1} sx={{ borderBottom: '1px solid #e2e8f0' }}>
            <Tab label="Categories & SLAs" component={RouterLink} to="/admin/categories" />
            <Tab label="Service Teams" component={RouterLink} to="/admin/teams" />
            <Tab label="Staff Users & Roles" component={RouterLink} to="/admin/users" />
          </Tabs>
        </Paper>
      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6" fontWeight={700}>
          Municipal Service Teams & Field Crews
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          size="small"
          onClick={() => setOpen(true)}
        >
          Add Service Team
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
                  <TableCell>Team Name</TableCell>
                  <TableCell>Operational Scope / Description</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {teams?.map((team) => (
                  <TableRow key={team.id} hover>
                    <TableCell sx={{ fontWeight: 700 }}>{team.name}</TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>{team.description || '—'}</TableCell>
                    <TableCell>
                      <Chip
                        label={team.active ? 'Active' : 'Inactive'}
                        size="small"
                        color={team.active ? 'success' : 'default'}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Dialog to create team */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Add Municipal Service Team</DialogTitle>
        <DialogContent dividers>
          {createMutation.isError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Failed to create team.
            </Alert>
          )}

          <TextField
            label="Team Name"
            placeholder="e.g. Bridges & Tunnels Maintenance"
            fullWidth
            required
            size="small"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mb: 2, mt: 1 }}
          />

          <TextField
            label="Description / Scope"
            fullWidth
            multiline
            rows={2}
            size="small"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            disabled={!name.trim() || createMutation.isPending}
            onClick={() =>
              createMutation.mutate({
                name: name.trim(),
                description: description.trim(),
                active: true,
              })
            }
          >
            Create Team
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
