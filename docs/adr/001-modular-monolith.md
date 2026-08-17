# ADR 001: Modular Monolith Architecture

## Status
Accepted

## Context
Municipal service-operations platforms need high data consistency across issue lifecycles, user assignments, SLA tracking, and audit logging. Introducing a distributed microservices architecture (with multiple databases, message brokers like Kafka, and Kubernetes orchestration) adds significant operational complexity, latency, distributed transaction challenges, and deployment overhead without immediate organizational necessity.

## Decision
We chose a **modular monolith** implemented with Java 21 / Spring Boot 3 on the backend and a decoupled React SPA on the frontend.
- Strict package-by-domain boundaries (`issues`, `users`, `teams`, `categories`, `audit`, `security`).
- In-process domain events and transactional boundaries.
- Single unified PostgreSQL database with Flyway versioned migrations.

## Consequences
### Positive:
- Simplified local development via `docker compose up`.
- ACID transactions ensure atomic issue state transitions and audit logging.
- Clear code navigation and fast test execution.
- Lower cloud hosting costs and zero distributed network failures.

### Negative:
- All domain modules share the same deployment lifecycle. (Can be decomposed into microservices later if scaling boundaries ever demand it).
