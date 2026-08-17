package com.karenoganesian.civicflow.issues.api.dto;

import com.karenoganesian.civicflow.issues.domain.IssueStatus;
import jakarta.validation.constraints.NotNull;

public record StatusTransitionRequest(
        @NotNull(message = "Target status is required")
        IssueStatus status,

        String publicMessage,

        String internalMessage
) {}
