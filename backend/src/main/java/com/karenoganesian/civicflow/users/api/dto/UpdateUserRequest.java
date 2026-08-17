package com.karenoganesian.civicflow.users.api.dto;

import com.karenoganesian.civicflow.users.domain.UserRole;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record UpdateUserRequest(
        @Size(max = 150, message = "Display name must not exceed 150 characters")
        String displayName,

        @Size(min = 8, message = "Password must be at least 8 characters")
        String password,

        UserRole role,

        UUID teamId,

        Boolean active
) {}
