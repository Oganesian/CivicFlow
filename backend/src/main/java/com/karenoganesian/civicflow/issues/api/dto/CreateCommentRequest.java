package com.karenoganesian.civicflow.issues.api.dto;

import com.karenoganesian.civicflow.issues.domain.CommentVisibility;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateCommentRequest(
        @NotBlank(message = "Comment body is required")
        String body,

        @NotNull(message = "Visibility is required")
        CommentVisibility visibility
) {}
