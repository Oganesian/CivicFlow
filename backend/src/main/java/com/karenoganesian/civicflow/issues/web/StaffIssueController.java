package com.karenoganesian.civicflow.issues.web;

import com.karenoganesian.civicflow.audit.api.dto.IssueEventResponse;
import com.karenoganesian.civicflow.audit.application.AuditEventService;
import com.karenoganesian.civicflow.common.PagedResponse;
import com.karenoganesian.civicflow.issues.api.dto.AssignIssueRequest;
import com.karenoganesian.civicflow.issues.api.dto.CommentResponse;
import com.karenoganesian.civicflow.issues.api.dto.CreateCommentRequest;
import com.karenoganesian.civicflow.issues.api.dto.IssueDetailResponse;
import com.karenoganesian.civicflow.issues.api.dto.IssueSummaryResponse;
import com.karenoganesian.civicflow.issues.api.dto.StatusTransitionRequest;
import com.karenoganesian.civicflow.issues.api.dto.UpdateIssueRequest;
import com.karenoganesian.civicflow.issues.application.IssueAssignmentService;
import com.karenoganesian.civicflow.issues.application.IssueService;
import com.karenoganesian.civicflow.issues.application.StatusTransitionService;
import com.karenoganesian.civicflow.issues.domain.Issue;
import com.karenoganesian.civicflow.issues.domain.IssueStatus;
import com.karenoganesian.civicflow.issues.domain.Priority;
import com.karenoganesian.civicflow.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/issues")
@PreAuthorize("hasAnyRole('DISPATCHER', 'TECHNICIAN', 'ADMIN')")
@Tag(name = "Staff Operations Issues", description = "Operational management, triage, assignment, and status transition endpoints")
public class StaffIssueController {

    private final IssueService issueService;
    private final IssueAssignmentService issueAssignmentService;
    private final StatusTransitionService statusTransitionService;
    private final AuditEventService auditEventService;

    public StaffIssueController(
            IssueService issueService,
            IssueAssignmentService issueAssignmentService,
            StatusTransitionService statusTransitionService,
            AuditEventService auditEventService) {
        this.issueService = issueService;
        this.issueAssignmentService = issueAssignmentService;
        this.statusTransitionService = statusTransitionService;
        this.auditEventService = auditEventService;
    }

    @GetMapping
    @Operation(summary = "Search and filter operational issue queue with pagination")
    public ResponseEntity<PagedResponse<IssueSummaryResponse>> searchStaffIssues(
            @RequestParam(required = false) IssueStatus status,
            @RequestParam(required = false) Priority priority,
            @RequestParam(required = false) UUID categoryId,
            @RequestParam(required = false) UUID teamId,
            @RequestParam(required = false) UUID userId,
            @RequestParam(required = false) String district,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "updatedAt,desc") String sort) {

        String[] sortParts = sort.split(",");
        String sortProp = sortParts[0];
        Sort.Direction direction = (sortParts.length > 1 && sortParts[1].equalsIgnoreCase("asc"))
                ? Sort.Direction.ASC : Sort.Direction.DESC;

        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortProp));
        return ResponseEntity.ok(issueService.searchStaffIssues(status, priority, categoryId, teamId, userId, district, search, pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get full issue detail workspace including internal comments and audit trail")
    public ResponseEntity<IssueDetailResponse> getStaffIssueDetail(@PathVariable UUID id) {
        return ResponseEntity.ok(issueService.getStaffIssueDetail(id));
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Update issue metadata (priority, due date, category, location)")
    public ResponseEntity<IssueDetailResponse> updateIssue(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateIssueRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(issueService.updateIssue(id, request, principal));
    }

    @PostMapping("/{id}/assignments")
    @PreAuthorize("hasAnyRole('DISPATCHER', 'ADMIN')")
    @Operation(summary = "Assign issue to a municipal team and optional field technician")
    public ResponseEntity<IssueDetailResponse> assignIssue(
            @PathVariable UUID id,
            @Valid @RequestBody AssignIssueRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        Issue updated = issueAssignmentService.assignIssue(id, request, principal);
        return ResponseEntity.ok(issueService.getStaffIssueDetail(updated.getId()));
    }

    @PostMapping("/{id}/status-transitions")
    @Operation(summary = "Perform issue status transition with validation and audit trail")
    public ResponseEntity<IssueDetailResponse> transitionStatus(
            @PathVariable UUID id,
            @Valid @RequestBody StatusTransitionRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        Issue updated = statusTransitionService.transitionStatus(id, request, principal);
        return ResponseEntity.ok(issueService.getStaffIssueDetail(updated.getId()));
    }

    @GetMapping("/{id}/comments")
    @Operation(summary = "List all internal and public comments for an issue")
    public ResponseEntity<List<CommentResponse>> getComments(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(issueService.getComments(id, principal));
    }

    @PostMapping("/{id}/comments")
    @Operation(summary = "Add an internal operational note or public citizen update")
    public ResponseEntity<CommentResponse> addComment(
            @PathVariable UUID id,
            @Valid @RequestBody CreateCommentRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        CommentResponse response = issueService.addComment(id, request, principal);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}/events")
    @Operation(summary = "Get immutable audit event history for an issue")
    public ResponseEntity<List<IssueEventResponse>> getEvents(@PathVariable UUID id) {
        return ResponseEntity.ok(auditEventService.getEventsForIssue(id));
    }
}
