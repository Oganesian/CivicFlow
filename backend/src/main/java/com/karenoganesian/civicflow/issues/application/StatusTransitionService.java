package com.karenoganesian.civicflow.issues.application;

import com.karenoganesian.civicflow.audit.application.AuditEventService;
import com.karenoganesian.civicflow.audit.domain.IssueEventType;
import com.karenoganesian.civicflow.common.InvalidStateTransitionException;
import com.karenoganesian.civicflow.common.ResourceNotFoundException;
import com.karenoganesian.civicflow.issues.api.dto.StatusTransitionRequest;
import com.karenoganesian.civicflow.issues.domain.CommentVisibility;
import com.karenoganesian.civicflow.issues.domain.Issue;
import com.karenoganesian.civicflow.issues.domain.IssueComment;
import com.karenoganesian.civicflow.issues.domain.IssueStatus;
import com.karenoganesian.civicflow.issues.persistence.IssueCommentRepository;
import com.karenoganesian.civicflow.issues.persistence.IssueRepository;
import com.karenoganesian.civicflow.security.UserPrincipal;
import com.karenoganesian.civicflow.users.domain.User;
import com.karenoganesian.civicflow.users.domain.UserRole;
import com.karenoganesian.civicflow.users.persistence.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
public class StatusTransitionService {

    private final IssueRepository issueRepository;
    private final IssueCommentRepository issueCommentRepository;
    private final UserRepository userRepository;
    private final AuditEventService auditEventService;

    public StatusTransitionService(
            IssueRepository issueRepository,
            IssueCommentRepository issueCommentRepository,
            UserRepository userRepository,
            AuditEventService auditEventService) {
        this.issueRepository = issueRepository;
        this.issueCommentRepository = issueCommentRepository;
        this.userRepository = userRepository;
        this.auditEventService = auditEventService;
    }

    @Transactional
    public Issue transitionStatus(UUID issueId, StatusTransitionRequest request, UserPrincipal principal) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found with id: " + issueId));

        IssueStatus currentStatus = issue.getStatus();
        IssueStatus targetStatus = request.status();

        if (currentStatus == targetStatus) {
            return issue;
        }

        // Validate Role and Permission Boundaries
        validateRolePermissions(issue, currentStatus, targetStatus, principal);

        // Validate State Machine Rules
        validateStateTransitions(currentStatus, targetStatus);

        // Resolution & Closure require explanation
        if (targetStatus == IssueStatus.RESOLVED && (request.publicMessage() == null || request.publicMessage().isBlank())) {
            throw new InvalidStateTransitionException("Resolving an issue requires a public resolution explanation message.");
        }

        User actor = principal != null ? userRepository.findById(principal.getId()).orElse(null) : null;

        // Perform Transition
        issue.setStatus(targetStatus);
        if (targetStatus == IssueStatus.RESOLVED && issue.getResolvedAt() == null) {
            issue.setResolvedAt(Instant.now());
        }

        Issue saved = issueRepository.save(issue);

        // Record Audit Event
        IssueEventType eventType = switch (targetStatus) {
            case TRIAGED -> IssueEventType.TRIAGED;
            case RESOLVED -> IssueEventType.RESOLVED;
            case CLOSED -> IssueEventType.CLOSED;
            default -> IssueEventType.STATUS_CHANGED;
        };

        String metadata = String.format("{\"publicMessage\":%s,\"internalMessage\":%s}",
                request.publicMessage() != null ? "\"" + escapeJson(request.publicMessage()) + "\"" : "null",
                request.internalMessage() != null ? "\"" + escapeJson(request.internalMessage()) + "\"" : "null");

        auditEventService.recordEvent(
                saved,
                actor,
                eventType,
                currentStatus.name(),
                targetStatus.name(),
                metadata
        );

        // Add public/internal comments if provided
        if (request.publicMessage() != null && !request.publicMessage().isBlank()) {
            IssueComment publicComment = new IssueComment(
                    null, saved, actor, request.publicMessage().trim(), CommentVisibility.PUBLIC
            );
            issueCommentRepository.save(publicComment);
        }

        if (request.internalMessage() != null && !request.internalMessage().isBlank()) {
            IssueComment internalComment = new IssueComment(
                    null, saved, actor, request.internalMessage().trim(), CommentVisibility.INTERNAL
            );
            issueCommentRepository.save(internalComment);
        }

        return saved;
    }

    private void validateRolePermissions(Issue issue, IssueStatus current, IssueStatus target, UserPrincipal principal) {
        if (principal == null) {
            throw new AccessDeniedException("Authentication required for status transitions.");
        }

        UserRole role = principal.getRole();

        if (role == UserRole.RESIDENT) {
            throw new AccessDeniedException("Residents cannot change operational issue status.");
        }

        // Only Dispatchers and Admins can triage or reject
        if ((target == IssueStatus.TRIAGED || target == IssueStatus.REJECTED || current == IssueStatus.NEW)
                && role != UserRole.DISPATCHER && role != UserRole.ADMIN) {
            throw new AccessDeniedException("Only dispatchers or administrators may triage, reject, or move issues out of NEW status.");
        }

        // Technicians can only update issues assigned to their own team
        if (role == UserRole.TECHNICIAN) {
            if (issue.getAssignedTeam() == null || !issue.getAssignedTeam().getId().equals(principal.getTeamId())) {
                throw new AccessDeniedException("Technicians may only update issues assigned to their own service team.");
            }
            if (target == IssueStatus.CLOSED || target == IssueStatus.REJECTED) {
                throw new AccessDeniedException("Only dispatchers or administrators may formally close or reject issues.");
            }
        }
    }

    private void validateStateTransitions(IssueStatus current, IssueStatus target) {
        boolean valid = switch (current) {
            case NEW -> target == IssueStatus.TRIAGED || target == IssueStatus.REJECTED;
            case TRIAGED -> target == IssueStatus.ASSIGNED || target == IssueStatus.IN_PROGRESS || target == IssueStatus.REJECTED;
            case ASSIGNED -> target == IssueStatus.IN_PROGRESS || target == IssueStatus.TRIAGED || target == IssueStatus.REJECTED;
            case IN_PROGRESS -> target == IssueStatus.RESOLVED || target == IssueStatus.ASSIGNED || target == IssueStatus.TRIAGED;
            case RESOLVED -> target == IssueStatus.CLOSED || target == IssueStatus.IN_PROGRESS;
            case CLOSED -> false; // Terminal
            case REJECTED -> false; // Terminal
        };

        if (!valid) {
            throw new InvalidStateTransitionException(
                    String.format("Invalid status transition: cannot move issue from %s to %s.", current, target)
            );
        }
    }

    private String escapeJson(String input) {
        return input.replace("\"", "\\\"").replace("\n", "\\n").replace("\r", "");
    }
}
