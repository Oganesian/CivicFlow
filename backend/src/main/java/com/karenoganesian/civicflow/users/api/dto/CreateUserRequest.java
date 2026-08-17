package com.karenoganesian.civicflow.users.api.dto;

import com.karenoganesian.civicflow.users.domain.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record CreateUserRequest(
        @NotBlank(message = "Email is required")
        @Email(message = "Please provide a valid email address")
        String email,

        @NotBlank(message = "Display name is required")
        @Size(max = 150, message = "Display name must not exceed 150 characters")
        String displayName,

        @NotBlank(message = "Password is required")
        @Size(min = 8, message = "Password must be at least 8 characters")
        String password,

        @NotNull(message = "User role is required")
        UserRole role,

        UUID teamId,

        Boolean active
) {}
