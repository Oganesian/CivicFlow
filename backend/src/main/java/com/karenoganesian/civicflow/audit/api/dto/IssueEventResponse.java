package com.karenoganesian.civicflow.audit.api.dto;

import com.karenoganesian.civicflow.audit.domain.IssueEvent;
import com.karenoganesian.civicflow.audit.domain.IssueEventType;

import java.time.Instant;
import java.util.UUID;

public record IssueEventResponse(
        UUID id,
        UUID issueId,
        UUID actorId,
        String actorName,
        IssueEventType eventType,
        String previousValue,
        String newValue,
        String metadataJson,
        Instant createdAt
) {
    public static IssueEventResponse from(IssueEvent event) {
        return new IssueEventResponse(
                event.getId(),
                event.getIssue().getId(),
                event.getActor() != null ? event.getActor().getId() : null,
                event.getActor() != null ? event.getActor().getDisplayName() : "Public / System",
                event.getEventType(),
                event.getPreviousValue(),
                event.getNewValue(),
                event.getMetadataJson(),
                event.getCreatedAt()
        );
    }
}
