package com.karenoganesian.civicflow.issues.api.dto;

import com.karenoganesian.civicflow.audit.api.dto.IssueEventResponse;
import com.karenoganesian.civicflow.categories.api.dto.CategoryResponse;
import com.karenoganesian.civicflow.issues.domain.Issue;
import com.karenoganesian.civicflow.issues.domain.IssueStatus;
import com.karenoganesian.civicflow.issues.domain.Priority;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record IssueDetailResponse(
        UUID id,
        String referenceCode,
        String title,
        String description,
        CategoryResponse category,
        IssueStatus status,
        Priority priority,
        String reporterEmail,
        String locationName,
        Double latitude,
        Double longitude,
        String district,
        UUID assignedTeamId,
        String assignedTeamName,
        UUID assignedUserId,
        String assignedUserName,
        Instant dueAt,
        Instant resolvedAt,
        long version,
        Instant createdAt,
        Instant updatedAt,
        List<CommentResponse> comments,
        List<IssueEventResponse> events
) {
    public static IssueDetailResponse from(
            Issue issue,
            List<CommentResponse> comments,
            List<IssueEventResponse> events) {
        return new IssueDetailResponse(
                issue.getId(),
                issue.getReferenceCode(),
                issue.getTitle(),
                issue.getDescription(),
                CategoryResponse.from(issue.getCategory()),
                issue.getStatus(),
                issue.getPriority(),
                issue.getReporterEmail(),
                issue.getLocationName(),
                issue.getLatitude(),
                issue.getLongitude(),
                issue.getDistrict(),
                issue.getAssignedTeam() != null ? issue.getAssignedTeam().getId() : null,
                issue.getAssignedTeam() != null ? issue.getAssignedTeam().getName() : null,
                issue.getAssignedUser() != null ? issue.getAssignedUser().getId() : null,
                issue.getAssignedUser() != null ? issue.getAssignedUser().getDisplayName() : null,
                issue.getDueAt(),
                issue.getResolvedAt(),
                issue.getVersion(),
                issue.getCreatedAt(),
                issue.getUpdatedAt(),
                comments != null ? comments : List.of(),
                events != null ? events : List.of()
        );
    }
}
