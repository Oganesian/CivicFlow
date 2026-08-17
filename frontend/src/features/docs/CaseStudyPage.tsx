import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Chip,
  Divider,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import CodeIcon from '@mui/icons-material/Code';
import SecurityIcon from '@mui/icons-material/Security';
import StorageIcon from '@mui/icons-material/Storage';
import ArchitectureIcon from '@mui/icons-material/Architecture';

export const CaseStudyPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Title */}
      <Box mb={5}>
        <Chip label="Engineering Case Study" color="primary" size="small" sx={{ mb: 1.5, fontWeight: 700 }} />
        <Typography variant="h3" component="h1" fontWeight={800} gutterBottom>
          CivicFlow — Architecture & Technical Case Study
        </Typography>
        <Typography variant="body1" color="text.secondary" maxWidth={800}>
          A production-style modular monolith platform for municipal issue reporting, dispatcher triage, and technician field resolution.
        </Typography>
      </Box>

      {/* Portfolio Cards Highlight */}
      <Grid container spacing={3} mb={6}>
        {/* English Card */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ height: '100%', borderColor: '#3b82f6', backgroundColor: '#f0f9ff' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="subtitle2" fontWeight={800} color="#1e3a8a">
                  Featured Portfolio Card (EN)
                </Typography>
                <Chip label="English" size="small" />
              </Box>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                CivicFlow — Service Operations Platform
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontStyle: 'italic' }}>
                "A production-style platform for reporting, triaging, and resolving public-service issues. I designed and built the complete workflow: a React operations console, a Spring Boot API, role-based access control, PostgreSQL persistence, audit history, automated tests, containerised local development, and a live demo with fictional data."
              </Typography>
              <Box display="flex" gap={0.8} flexWrap="wrap">
                <Chip label="React" size="small" />
                <Chip label="TypeScript" size="small" />
                <Chip label="Java 21" size="small" />
                <Chip label="Spring Boot" size="small" />
                <Chip label="PostgreSQL" size="small" />
                <Chip label="Docker" size="small" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* German Card */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ height: '100%', borderColor: '#10b981', backgroundColor: '#f0fdf4' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="subtitle2" fontWeight={800} color="#065f46">
                  Featured Portfolio Card (DE)
                </Typography>
                <Chip label="Deutsch" size="small" />
              </Box>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                CivicFlow — Plattform für Service-Operations
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontStyle: 'italic' }}>
                "Eine produktionsnahe Plattform zum Melden, Priorisieren und Bearbeiten kommunaler Anliegen. Ich habe den vollständigen Workflow umgesetzt: React-Operations-Console, Spring-Boot-API, rollenbasierte Zugriffskontrolle, PostgreSQL-Persistenz, Audit-Historie, automatisierte Tests, containerisierte lokale Umgebung und eine Live-Demo mit fiktiven Daten."
              </Typography>
              <Box display="flex" gap={0.8} flexWrap="wrap">
                <Chip label="React" size="small" />
                <Chip label="TypeScript" size="small" />
                <Chip label="Java 21" size="small" />
                <Chip label="Spring Boot" size="small" />
                <Chip label="PostgreSQL" size="small" />
                <Chip label="Docker" size="small" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Case Study Sections */}
      <Paper variant="outlined" sx={{ p: { xs: 3, md: 5 }, borderRadius: 3, mb: 4 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ArchitectureIcon color="primary" /> 1. Problem & Product Context
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Municipal operations teams frequently struggle with fragmented reporting channels (unstructured emails, phone logs, paper tickets) that lack auditability, clear SLAs, and public transparency. Citizens have no visibility into resolution progress, leading to duplicate reports and frustration.
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          <strong>CivicFlow</strong> solves this with a cohesive, end-to-end platform featuring two distinct experiences: an unauthenticated <strong>Public Portal</strong> for easy issue reporting and timeline tracking, and an authenticated <strong>Operations Console</strong> for staff triage, team assignment, and audit-logged resolution.
        </Typography>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h5" fontWeight={700} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <StorageIcon color="primary" /> 2. Why a Modular Monolith?
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Rather than introducing distributed microservices, message brokers (e.g. Kafka), and Kubernetes merely to display technologies, CivicFlow was deliberately designed as a <strong>modular monolith</strong>:
        </Typography>
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} sm={6}>
            <Paper variant="outlined" sx={{ p: 2, backgroundColor: '#f8fafc' }}>
              <Typography variant="subtitle2" fontWeight={700}>
                Transactional Integrity (ACID)
              </Typography>
              <Typography variant="caption" color="text.secondary">
                State transitions, team reassignments, and audit event logs are committed atomically without two-phase commit overhead or saga complexity.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper variant="outlined" sx={{ p: 2, backgroundColor: '#f8fafc' }}>
              <Typography variant="subtitle2" fontWeight={700}>
                Operational Simplicity
              </Typography>
              <Typography variant="caption" color="text.secondary">
                One deployable container, fast integration test execution with Testcontainers, and zero inter-service network failure modes.
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h5" fontWeight={700} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SecurityIcon color="primary" /> 3. Privacy & Public Data Boundary
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          A core architectural requirement is ensuring zero sensitive data leaks across the public boundary:
        </Typography>
        <ul>
          <li>
            <Typography variant="body2" color="text.secondary">
              <strong>Dedicated DTO Separation:</strong> JPA entities are never exposed to controllers. The public API exclusively outputs <code>PublicIssueResponse</code> DTOs.
            </Typography>
          </li>
          <li>
            <Typography variant="body2" color="text.secondary">
              <strong>Citizen Email Privacy:</strong> Reporter emails are optional and strictly confidential for internal notifications; they are completely omitted from public API serialization.
            </Typography>
          </li>
          <li>
            <Typography variant="body2" color="text.secondary">
              <strong>Comment & Timeline Isolation:</strong> Comments have strict <code>PUBLIC</code> vs <code>INTERNAL</code> visibility, filtered at the database query layer.
            </Typography>
          </li>
        </ul>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h5" fontWeight={700} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CodeIcon color="primary" /> 4. Issue Lifecycle State Machine
        </Typography>
        <Box sx={{ p: 2.5, backgroundColor: '#0f172a', color: '#f8fafc', borderRadius: 2, fontFamily: 'monospace', fontSize: '0.85rem', mb: 3 }}>
          NEW → TRIAGED → ASSIGNED → IN_PROGRESS → RESOLVED → CLOSED<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↘ REJECTED
        </Box>
        <Typography variant="body2" color="text.secondary">
          Only Dispatchers and Administrators can triage or reject. Field technicians may update only issues assigned to their specific municipal team. Transitioning to <code>RESOLVED</code> strictly enforces a public explanation message.
        </Typography>
      </Paper>

      {/* Action Links */}
      <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
        <Button
          component={RouterLink}
          to="/report"
          variant="contained"
          color="primary"
          size="large"
        >
          Try Public Reporting Flow
        </Button>
        <Button
          component={RouterLink}
          to="/login"
          variant="outlined"
          size="large"
        >
          Log in with Demo Account
        </Button>
      </Box>
    </Container>
  );
};
