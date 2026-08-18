import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box, Alert } from '@mui/material';
import { QueryClientProvider } from '@tanstack/react-query';
import { theme } from './theme';
import { queryClient } from './queryClient';
import { AuthProvider } from '../auth/AuthContext';
import { ProtectedRoute } from '../auth/ProtectedRoute';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

// Public Pages
import { LandingPage } from '../features/public/LandingPage';
import { ReportIssuePage } from '../features/public/ReportIssuePage';
import { PublicExplorerPage } from '../features/public/PublicExplorerPage';
import { PublicIssueDetailPage } from '../features/public/PublicIssueDetailPage';

// Operations Pages
import { LoginPage } from '../features/operations/LoginPage';
import { OperationsDashboardPage } from '../features/operations/OperationsDashboardPage';
import { WorkQueuePage } from '../features/operations/WorkQueuePage';
import { IssueWorkspacePage } from '../features/operations/IssueWorkspacePage';
import { MyWorkPage } from '../features/operations/MyWorkPage';

// Admin Pages
import { AdminCategoriesPage } from '../features/admin/AdminCategoriesPage';
import { AdminTeamsPage } from '../features/admin/AdminTeamsPage';
import { AdminUsersPage } from '../features/admin/AdminUsersPage';

// Docs & Case Study
import { CaseStudyPage } from '../features/docs/CaseStudyPage';

export const App: React.FC = () => {
  const [showDemoNote, setShowDemoNote] = useState(() => {
    // Only show the note once per session (stored in sessionStorage)
    return sessionStorage.getItem('civicflow_demo_note_dismissed') !== 'true';
  });

  const handleCloseDemoNote = () => {
    setShowDemoNote(false);
    sessionStorage.setItem('civicflow_demo_note_dismissed', 'true');
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <BrowserRouter>
            <Box display="flex" flexDirection="column" minHeight="100vh">
              <Navbar />
              {showDemoNote && (
                <Alert severity="info" sx={{ m: 2, mb: 0 }} onClose={handleCloseDemoNote}>
                  <strong>Demo Note:</strong> The backend may take 50-60 seconds to start after periods of inactivity. Please be patient if you experience delays on first load.
                </Alert>
              )}
              <Box component="main" flexGrow={1}>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/report" element={<ReportIssuePage />} />
                  <Route path="/explorer" element={<PublicExplorerPage />} />
                  <Route path="/issues/:referenceCode" element={<PublicIssueDetailPage />} />
                  <Route path="/case-study" element={<CaseStudyPage />} />
                  <Route path="/login" element={<LoginPage />} />

                  {/* Operational console routes (Protected) */}
                  <Route
                    path="/operations/dashboard"
                    element={
                      <ProtectedRoute allowedRoles={['DISPATCHER', 'TECHNICIAN', 'ADMIN']}>
                        <OperationsDashboardPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/operations/queue"
                    element={
                      <ProtectedRoute allowedRoles={['DISPATCHER', 'TECHNICIAN', 'ADMIN']}>
                        <WorkQueuePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/operations/workspace/:id"
                    element={
                      <ProtectedRoute allowedRoles={['DISPATCHER', 'TECHNICIAN', 'ADMIN']}>
                        <IssueWorkspacePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/operations/my-work"
                    element={
                      <ProtectedRoute allowedRoles={['TECHNICIAN', 'DISPATCHER', 'ADMIN']}>
                        <MyWorkPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Admin routes (Protected for ADMIN only) */}
                  <Route
                    path="/admin/categories"
                    element={
                      <ProtectedRoute allowedRoles={['ADMIN']}>
                        <AdminCategoriesPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/teams"
                    element={
                      <ProtectedRoute allowedRoles={['ADMIN']}>
                        <AdminTeamsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/users"
                    element={
                      <ProtectedRoute allowedRoles={['ADMIN']}>
                        <AdminUsersPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Box>
              <Footer />
            </Box>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};
