package com.karenoganesian.civicflow.issues.api.dto;

import com.karenoganesian.civicflow.categories.api.dto.CategoryResponse;
import com.karenoganesian.civicflow.issues.domain.Issue;
import com.karenoganesian.civicflow.issues.domain.IssueStatus;
import com.karenoganesian.civicflow.issues.domain.Priority;

import java.time.Instant;
import java.util.List;

public record PublicIssueResponse(
        String referenceCode,
        String title,
        String description,
        CategoryResponse category,
        IssueStatus status,
        Priority priority,
        String locationName,
        Double latitude,
        Double longitude,
        String district,
        Instant createdAt,
        Instant updatedAt,
        Instant resolvedAt,
        List<PublicTimelineItemDto> publicTimeline
) {
    public static PublicIssueResponse from(Issue issue, List<PublicTimelineItemDto> timeline) {
        return new PublicIssueResponse(
                issue.getReferenceCode(),
                issue.getTitle(),
                issue.getDescription(),
                CategoryResponse.from(issue.getCategory()),
                issue.getStatus(),
                issue.getPriority(),
                issue.getLocationName(),
                issue.getLatitude(),
                issue.getLongitude(),
                issue.getDistrict(),
                issue.getCreatedAt(),
                issue.getUpdatedAt(),
                issue.getResolvedAt(),
                timeline != null ? timeline : List.of()
        );
    }
}
