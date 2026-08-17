import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider,
} from '@mui/material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import HandymanOutlinedIcon from '@mui/icons-material/HandymanOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import { useAuth } from '../auth/AuthContext';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMenuEl, setMobileMenuEl] = React.useState<null | HTMLElement>(null);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuEl(null);
  };

  const handleLogout = async () => {
    handleMenuClose();
    await logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Demo Banner */}
      <Box
        sx={{
          backgroundColor: '#0f172a',
          color: '#cbd5e1',
          py: 0.5,
          px: 2,
          textAlign: 'center',
          fontSize: '0.75rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 1.5,
        }}
      >
        <Typography variant="caption" sx={{ color: '#94a3b8' }}>
          🛡️ <strong>Live Demonstration:</strong> Fictional municipal data. Do not submit personal information.
        </Typography>
        <Chip
          label="Modular Monolith Demo"
          size="small"
          sx={{
            height: 18,
            fontSize: '0.65rem',
            backgroundColor: '#1e293b',
            color: '#38bdf8',
            border: '1px solid #334155',
          }}
        />
      </Box>

      <AppBar position="sticky" elevation={0}>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ minHeight: 64 }}>
            {/* Brand Logo */}
            <Box
              component={RouterLink}
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.2,
                textDecoration: 'none',
                color: 'inherit',
                mr: 3,
              }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 2,
                  backgroundColor: '#1e3a8a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '1.2rem',
                }}
              >
                C
              </Box>
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: '"Outfit", sans-serif',
                    fontWeight: 700,
                    lineHeight: 1.1,
                    color: '#1e3a8a',
                    letterSpacing: '-0.02em',
                  }}
                >
                  CivicFlow
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.68rem', fontWeight: 600 }}>
                  Service Operations
                </Typography>
              </Box>
            </Box>

            {/* Desktop Navigation Links */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 1 }}>
              {/* Public Portal Links */}
              <Button
                component={RouterLink}
                to="/report"
                startIcon={<AddCircleOutlineIcon />}
                variant={isActive('/report') ? 'contained' : 'text'}
                color="primary"
                size="small"
              >
                Report Issue
              </Button>
              <Button
                component={RouterLink}
                to="/explorer"
                startIcon={<ExploreOutlinedIcon />}
                variant={isActive('/explorer') ? 'contained' : 'text'}
                color="inherit"
                size="small"
                sx={{ color: isActive('/explorer') ? '#ffffff' : '#334155' }}
              >
                Public Explorer
              </Button>

              {/* Authenticated Staff Links */}
              {isAuthenticated && (
                <>
                  <Divider orientation="vertical" flexItem sx={{ mx: 1, my: 1.5 }} />
                  <Button
                    component={RouterLink}
                    to="/operations/dashboard"
                    startIcon={<DashboardOutlinedIcon />}
                    variant={isActive('/operations/dashboard') ? 'contained' : 'text'}
                    color="inherit"
                    size="small"
                    sx={{ color: isActive('/operations/dashboard') ? '#ffffff' : '#334155' }}
                  >
                    Dashboard
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/operations/queue"
                    startIcon={<AssignmentOutlinedIcon />}
                    variant={isActive('/operations/queue') ? 'contained' : 'text'}
                    color="inherit"
                    size="small"
                    sx={{ color: isActive('/operations/queue') ? '#ffffff' : '#334155' }}
                  >
                    Work Queue
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/operations/my-work"
                    startIcon={<HandymanOutlinedIcon />}
                    variant={isActive('/operations/my-work') ? 'contained' : 'text'}
                    color="inherit"
                    size="small"
                    sx={{ color: isActive('/operations/my-work') ? '#ffffff' : '#334155' }}
                  >
                    My Work
                  </Button>
                  {user?.role === 'ADMIN' && (
                    <Button
                      component={RouterLink}
                      to="/admin/categories"
                      startIcon={<AdminPanelSettingsOutlinedIcon />}
                      variant={location.pathname.startsWith('/admin') ? 'contained' : 'text'}
                      color="inherit"
                      size="small"
                      sx={{ color: location.pathname.startsWith('/admin') ? '#ffffff' : '#334155' }}
                    >
                      Admin
                    </Button>
                  )}
                </>
              )}

              <Button
                component={RouterLink}
                to="/case-study"
                startIcon={<ArticleOutlinedIcon />}
                variant={isActive('/case-study') ? 'contained' : 'text'}
                color="inherit"
                size="small"
                sx={{ color: isActive('/case-study') ? '#ffffff' : '#475569', ml: 'auto' }}
              >
                Case Study
              </Button>
            </Box>

            {/* Mobile Menu Icon */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, ml: 'auto' }}>
              <IconButton onClick={handleMobileMenuOpen} color="inherit">
                <MenuIcon />
              </IconButton>
            </Box>

            {/* Right Action: Auth / User Profile */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1.5, ml: 2 }}>
              {isAuthenticated && user ? (
                <>
                  <Chip
                    label={user.role}
                    color={user.role === 'ADMIN' ? 'error' : user.role === 'DISPATCHER' ? 'warning' : 'primary'}
                    size="small"
                    sx={{ fontWeight: 700, fontSize: '0.7rem' }}
                  />
                  <IconButton onClick={handleProfileMenuOpen} size="small" sx={{ p: 0.5 }}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: '#1e3a8a', fontSize: '0.85rem' }}>
                      {user.displayName.charAt(0)}
                    </Avatar>
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  >
                    <Box sx={{ px: 2, py: 1 }}>
                      <Typography variant="subtitle2">{user.displayName}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {user.email}
                      </Typography>
                    </Box>
                    <Divider />
                    <MenuItem onClick={handleLogout}>Log out</MenuItem>
                  </Menu>
                </>
              ) : (
                <Button
                  component={RouterLink}
                  to="/login"
                  variant="outlined"
                  size="small"
                  startIcon={<AccountCircleIcon />}
                >
                  Staff Login
                </Button>
              )}
            </Box>

            {/* Mobile Dropdown Menu */}
            <Menu
              anchorEl={mobileMenuEl}
              open={Boolean(mobileMenuEl)}
              onClose={handleMobileMenuClose}
            >
              <MenuItem component={RouterLink} to="/report" onClick={handleMobileMenuClose}>
                Report Issue
              </MenuItem>
              <MenuItem component={RouterLink} to="/explorer" onClick={handleMobileMenuClose}>
                Public Explorer
              </MenuItem>
              <MenuItem component={RouterLink} to="/case-study" onClick={handleMobileMenuClose}>
                Architecture Case Study
              </MenuItem>
              {isAuthenticated && (
                <>
                  <Divider />
                  <MenuItem component={RouterLink} to="/operations/dashboard" onClick={handleMobileMenuClose}>
                    Operations Dashboard
                  </MenuItem>
                  <MenuItem component={RouterLink} to="/operations/queue" onClick={handleMobileMenuClose}>
                    Work Queue
                  </MenuItem>
                  <MenuItem component={RouterLink} to="/operations/my-work" onClick={handleMobileMenuClose}>
                    My Assigned Work
                  </MenuItem>
                  {user?.role === 'ADMIN' && (
                    <MenuItem component={RouterLink} to="/admin/categories" onClick={handleMobileMenuClose}>
                      Administration
                    </MenuItem>
                  )}
                  <Divider />
                  <MenuItem onClick={handleLogout}>Log out ({user?.displayName})</MenuItem>
                </>
              )}
              {!isAuthenticated && (
                <MenuItem component={RouterLink} to="/login" onClick={handleMobileMenuClose}>
                  Staff Login
                </MenuItem>
              )}
            </Menu>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
};
