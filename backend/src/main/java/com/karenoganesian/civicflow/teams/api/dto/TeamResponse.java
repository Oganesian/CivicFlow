package com.karenoganesian.civicflow.teams.api.dto;

import com.karenoganesian.civicflow.teams.domain.Team;

import java.util.UUID;

public record TeamResponse(
        UUID id,
        String name,
        String description,
        boolean active
) {
    public static TeamResponse from(Team team) {
        return new TeamResponse(
                team.getId(),
                team.getName(),
                team.getDescription(),
                team.isActive()
        );
    }
}
