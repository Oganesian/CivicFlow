# ADR 003: Public Data Boundary & Privacy Enforcement

## Status
Accepted

## Context
A public municipal service portal must balance transparency (allowing residents to follow the status of potholes, broken lights, etc.) with strict privacy safeguards (preventing exposure of reporter personal details, internal staff discussions, private attachments, or operational notes).

## Decision
1. **Dedicated DTO Architecture**:
   - Entities (`Issue`, `User`, `IssueComment`, `IssueEvent`) are never exposed directly to controllers.
   - Public controllers (`/api/public/**`) only return `PublicIssueResponse`, `PublicTimelineItemDto`, and `PublicCategoryDto`.
2. **Reporter Privacy**:
   - `reporter_email` is optional and solely used for internal notifications or follow-up. It is explicitly omitted from all public DTO mappings.
3. **Comment & Timeline Visibility**:
   - Comments have an explicit `visibility` enum: `PUBLIC` vs `INTERNAL`.
   - Internal comments and internal events (like assignment handoffs) are filtered out at the service/database query level before generating public views.
4. **Identifier Separation**:
   - Public URLs and tracking use formatted human-readable reference codes (e.g. `CF-2026-00421`) rather than internal database primary keys.

## Consequences
- Impossible to accidentally leak sensitive fields via JPA entity serialization.
- Fully compliant with privacy and municipal open-government standards.
