package com.karenoganesian.civicflow.issues.api.dto;

import com.karenoganesian.civicflow.issues.domain.Priority;

import java.time.Instant;
import java.util.UUID;

public record UpdateIssueRequest(
        Priority priority,
        UUID categoryId,
        Instant dueAt,
        String district,
        String locationName
) {}
