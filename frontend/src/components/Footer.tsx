import React from 'react';
import { Box, Container, Typography, Grid, Link, Chip } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#0f172a',
        color: '#94a3b8',
        py: 6,
        mt: 'auto',
        borderTop: '1px solid #1e293b',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={5}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: 1.5,
                  backgroundColor: '#3b82f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                }}
              >
                C
              </Box>
              <Typography variant="h6" color="#ffffff" fontFamily='"Outfit", sans-serif'>
                CivicFlow
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#94a3b8', mb: 2, maxWidth: 360 }}>
              Portfolio-grade service-operations platform demonstrating modular monolith architecture,
              role-based municipal triage workflows, and privacy-preserving public boundaries.
            </Typography>
            <Box display="flex" gap={1} flexWrap="wrap">
              <Chip label="Java 21 / Spring Boot 3" size="small" sx={{ bgcolor: '#1e293b', color: '#93c5fd' }} />
              <Chip label="React 18 / TypeScript" size="small" sx={{ bgcolor: '#1e293b', color: '#6ee7b7' }} />
              <Chip label="PostgreSQL + Flyway" size="small" sx={{ bgcolor: '#1e293b', color: '#fbcfe8' }} />
            </Box>
          </Grid>

          <Grid item xs={6} md={3}>
            <Typography variant="subtitle2" color="#ffffff" gutterBottom>
              Public Access
            </Typography>
            <Box display="flex" flexDirection="column" gap={1}>
              <Link component={RouterLink} to="/report" color="inherit" underline="hover" variant="body2">
                Report a Service Issue
              </Link>
              <Link component={RouterLink} to="/explorer" color="inherit" underline="hover" variant="body2">
                Public Issue Explorer
              </Link>
              <Link component={RouterLink} to="/case-study" color="inherit" underline="hover" variant="body2">
                Architecture & ADRs
              </Link>
              <Link href="/swagger-ui/index.html" target="_blank" color="inherit" underline="hover" variant="body2">
                REST OpenAPI Documentation ↗
              </Link>
            </Box>
          </Grid>

          <Grid item xs={6} md={4}>
            <Typography variant="subtitle2" color="#ffffff" gutterBottom>
              Operations & Demo
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8', mb: 1.5 }}>
              Use the demo credentials on the login screen to test Dispatcher, Technician, and Admin roles.
            </Typography>
            <Link component={RouterLink} to="/login" color="#38bdf8" underline="hover" variant="body2" fontWeight={600}>
              Sign in to Operations Console →
            </Link>
          </Grid>
        </Grid>

        <Box
          sx={{
            mt: 4,
            pt: 3,
            borderTop: '1px solid #1e293b',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Typography variant="caption" color="#64748b">
            © 2026 CivicFlow Engineering — Fictional Municipal Data Demo. All rights reserved.
          </Typography>
          <Typography variant="caption" color="#64748b">
            Designed and built with modern full-stack craftsmanship.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};
