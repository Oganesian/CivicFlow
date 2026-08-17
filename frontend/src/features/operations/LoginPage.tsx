import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Alert,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  CircularProgress,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { useAuth } from '../../auth/AuthContext';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/operations/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail: string) => {
    setError(null);
    setLoading(true);
    try {
      await login(demoEmail, 'DemoPass!2026');
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Failed to authenticate with demo user.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Box textAlign="center" mb={4}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            backgroundColor: '#1e3a8a',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 1.5,
          }}
        >
          <LockOutlinedIcon />
        </Box>
        <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
          Municipal Staff Sign In
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Access the operations console for issue triage, work queue management, and resolution.
        </Typography>
      </Box>

      {/* 1-Click Demo Personas */}
      <Paper variant="outlined" sx={{ p: 3, mb: 4, borderRadius: 3, backgroundColor: '#f8fafc', borderColor: '#cbd5e1' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="subtitle2" fontWeight={700} color="#1e3a8a">
            ⚡ Quick 1-Click Demo Evaluation
          </Typography>
          <Chip label="Password: DemoPass!2026" size="small" sx={{ fontFamily: 'monospace', fontWeight: 600 }} />
        </Box>

        <Grid container spacing={1.5}>
          <Grid item xs={12} sm={4}>
            <Card variant="outlined" sx={{ '&:hover': { borderColor: '#3b82f6', bgcolor: '#ffffff' } }}>
              <CardActionArea onClick={() => handleDemoLogin('dispatcher@demo.civicflow.app')} sx={{ p: 1.5 }}>
                <CardContent sx={{ p: '0 !important', textAlign: 'center' }}>
                  <PersonOutlineIcon color="primary" fontSize="small" />
                  <Typography variant="subtitle2" fontWeight={700}>
                    Dispatcher
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Triage & Assign
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Card variant="outlined" sx={{ '&:hover': { borderColor: '#0d9488', bgcolor: '#ffffff' } }}>
              <CardActionArea onClick={() => handleDemoLogin('technician@demo.civicflow.app')} sx={{ p: 1.5 }}>
                <CardContent sx={{ p: '0 !important', textAlign: 'center' }}>
                  <PersonOutlineIcon color="secondary" fontSize="small" />
                  <Typography variant="subtitle2" fontWeight={700}>
                    Technician
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Field Resolution
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Card variant="outlined" sx={{ '&:hover': { borderColor: '#e11d48', bgcolor: '#ffffff' } }}>
              <CardActionArea onClick={() => handleDemoLogin('admin@demo.civicflow.app')} sx={{ p: 1.5 }}>
                <CardContent sx={{ p: '0 !important', textAlign: 'center' }}>
                  <PersonOutlineIcon color="error" fontSize="small" />
                  <Typography variant="subtitle2" fontWeight={700}>
                    Admin
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Full System Control
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Manual Login Form */}
      <Paper variant="outlined" sx={{ p: 4, borderRadius: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleLogin}>
          <TextField
            label="Email Address"
            type="email"
            fullWidth
            required
            size="small"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2.5 }}
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            required
            size="small"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 3 }}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} color="inherit" />}
            sx={{ py: 1.2, fontWeight: 700 }}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};
