package com.karenoganesian.civicflow.issues.api.dto;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record AssignIssueRequest(
        @NotNull(message = "Team ID is required")
        UUID teamId,

        UUID userId
) {}
