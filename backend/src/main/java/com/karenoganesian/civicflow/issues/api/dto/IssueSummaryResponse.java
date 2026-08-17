package com.karenoganesian.civicflow.issues.api.dto;

import com.karenoganesian.civicflow.categories.api.dto.CategoryResponse;
import com.karenoganesian.civicflow.issues.domain.Issue;
import com.karenoganesian.civicflow.issues.domain.IssueStatus;
import com.karenoganesian.civicflow.issues.domain.Priority;

import java.time.Instant;
import java.util.UUID;

public record IssueSummaryResponse(
        UUID id,
        String referenceCode,
        String title,
        CategoryResponse category,
        IssueStatus status,
        Priority priority,
        String locationName,
        String district,
        UUID assignedTeamId,
        String assignedTeamName,
        UUID assignedUserId,
        String assignedUserName,
        Instant dueAt,
        Instant createdAt,
        Instant updatedAt,
        boolean slaAtRisk
) {
    public static IssueSummaryResponse from(Issue issue) {
        boolean isSlaAtRisk = issue.getDueAt() != null
                && issue.getStatus() != IssueStatus.RESOLVED
                && issue.getStatus() != IssueStatus.CLOSED
                && issue.getStatus() != IssueStatus.REJECTED
                && issue.getDueAt().isBefore(Instant.now().plusSeconds(24 * 3600));

        return new IssueSummaryResponse(
                issue.getId(),
                issue.getReferenceCode(),
                issue.getTitle(),
                CategoryResponse.from(issue.getCategory()),
                issue.getStatus(),
                issue.getPriority(),
                issue.getLocationName(),
                issue.getDistrict(),
                issue.getAssignedTeam() != null ? issue.getAssignedTeam().getId() : null,
                issue.getAssignedTeam() != null ? issue.getAssignedTeam().getName() : null,
                issue.getAssignedUser() != null ? issue.getAssignedUser().getId() : null,
                issue.getAssignedUser() != null ? issue.getAssignedUser().getDisplayName() : null,
                issue.getDueAt(),
                issue.getCreatedAt(),
                issue.getUpdatedAt(),
                isSlaAtRisk
        );
    }
}
