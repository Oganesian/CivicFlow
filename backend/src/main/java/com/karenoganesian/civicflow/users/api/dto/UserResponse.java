package com.karenoganesian.civicflow.users.api.dto;

import com.karenoganesian.civicflow.users.domain.User;
import com.karenoganesian.civicflow.users.domain.UserRole;

import java.util.UUID;

public record UserResponse(
        UUID id,
        String email,
        String displayName,
        UserRole role,
        UUID teamId,
        String teamName,
        boolean active
) {
    public static UserResponse from(User user) {
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getDisplayName(),
                user.getRole(),
                user.getTeam() != null ? user.getTeam().getId() : null,
                user.getTeam() != null ? user.getTeam().getName() : null,
                user.isActive()
        );
    }
}
