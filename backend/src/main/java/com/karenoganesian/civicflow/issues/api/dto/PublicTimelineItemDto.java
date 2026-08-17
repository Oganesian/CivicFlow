package com.karenoganesian.civicflow.issues.api.dto;

import java.time.Instant;

public record PublicTimelineItemDto(
        String title,
        String message,
        String status,
        Instant timestamp
) {}
