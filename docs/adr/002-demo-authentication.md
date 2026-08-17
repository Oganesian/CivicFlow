# ADR 002: Authentication and Role-Based Access Control Strategy

## Status
Accepted

## Context
CivicFlow requires secure staff authentication, fine-grained role authorization (`DISPATCHER`, `TECHNICIAN`, `ADMIN`, `RESIDENT`), and low-friction demo evaluation for recruiters and reviewers.

## Decision
1. **Password Hashing**: BCrypt hashing with strong work factor.
2. **Tokens**: Signed HMAC-SHA256 JWT tokens containing `sub` (user email), `userId`, `role`, and `teamId`.
3. **Transport**:
   - Backend supports both `Authorization: Bearer <token>` headers (standard for SPA REST clients) and `HttpOnly` Secure cookies in production.
4. **Backend-Authoritative RBAC**: Spring Security annotations (`@PreAuthorize`) and service-level checks enforce permissions. Frontend routes/guards only manage UX visibility and are not treated as a security boundary.
5. **Seeded Demo Accounts**: Demo personas with pre-configured roles are provisioned via Flyway migration.

## Consequences
- Fast, self-contained authentication without requiring external IdP dependencies (e.g. Keycloak) for local running.
- Ready for future OIDC/SAML integration when municipal enterprise SSO is required.
