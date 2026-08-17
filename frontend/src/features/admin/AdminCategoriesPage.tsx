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
import { Category } from '../../api/types';

export const AdminCategoriesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [defaultSlaHours, setDefaultSlaHours] = useState(48);

  const { data: categories, isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: adminApi.getAllCategories,
  });

  const createMutation = useMutation({
    mutationFn: (data: Partial<Category>) => adminApi.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      setOpen(false);
      setName('');
      setSlug('');
      setDescription('');
    },
  });

  const handleNameChange = (val: string) => {
    setName(val);
    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
  };

  return (
    <Container maxWidth="xl" sx={{ py: 5 }}>
      {/* Admin Navigation Tabs */}
      <Box mb={4}>
        <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
          System Administration
        </Typography>
        <Paper variant="outlined" sx={{ borderRadius: 2 }}>
          <Tabs value={0} sx={{ borderBottom: '1px solid #e2e8f0' }}>
            <Tab label="Categories & SLAs" component={RouterLink} to="/admin/categories" />
            <Tab label="Service Teams" component={RouterLink} to="/admin/teams" />
            <Tab label="Staff Users & Roles" component={RouterLink} to="/admin/users" />
          </Tabs>
        </Paper>
      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6" fontWeight={700}>
          Issue Categories & SLA Targets
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          size="small"
          onClick={() => setOpen(true)}
        >
          Add Category
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
                  <TableCell>Category Name</TableCell>
                  <TableCell>URL Slug</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Default SLA Target</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categories?.map((cat) => (
                  <TableRow key={cat.id} hover>
                    <TableCell sx={{ fontWeight: 700 }}>{cat.name}</TableCell>
                    <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{cat.slug}</TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>{cat.description || '—'}</TableCell>
                    <TableCell>
                      <Chip label={`${cat.defaultSlaHours} hours`} size="small" sx={{ fontWeight: 600 }} />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={cat.active ? 'Active' : 'Inactive'}
                        size="small"
                        color={cat.active ? 'success' : 'default'}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Dialog to create category */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Create New Category</DialogTitle>
        <DialogContent dividers>
          {createMutation.isError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Failed to create category.
            </Alert>
          )}

          <TextField
            label="Category Name"
            fullWidth
            required
            size="small"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            sx={{ mb: 2, mt: 1 }}
          />

          <TextField
            label="Slug"
            fullWidth
            required
            size="small"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Description"
            fullWidth
            multiline
            rows={2}
            size="small"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Default SLA Target (Hours)"
            type="number"
            fullWidth
            required
            size="small"
            value={defaultSlaHours}
            onChange={(e) => setDefaultSlaHours(parseInt(e.target.value, 10) || 24)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            disabled={!name || !slug || createMutation.isPending}
            onClick={() =>
              createMutation.mutate({
                name,
                slug,
                description,
                defaultSlaHours,
                active: true,
              })
            }
          >
            Create Category
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
