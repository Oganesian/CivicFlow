package com.karenoganesian.civicflow.issues.api.dto;

import com.karenoganesian.civicflow.issues.domain.CommentVisibility;
import com.karenoganesian.civicflow.issues.domain.IssueComment;

import java.time.Instant;
import java.util.UUID;

public record CommentResponse(
        UUID id,
        UUID issueId,
        UUID authorId,
        String authorName,
        String body,
        CommentVisibility visibility,
        Instant createdAt
) {
    public static CommentResponse from(IssueComment comment) {
        return new CommentResponse(
                comment.getId(),
                comment.getIssue().getId(),
                comment.getAuthor() != null ? comment.getAuthor().getId() : null,
                comment.getAuthor() != null ? comment.getAuthor().getDisplayName() : "Public Resident",
                comment.getBody(),
                comment.getVisibility(),
                comment.getCreatedAt()
        );
    }
}
