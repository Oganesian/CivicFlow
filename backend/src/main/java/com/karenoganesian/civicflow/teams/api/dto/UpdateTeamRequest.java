package com.karenoganesian.civicflow.teams.api.dto;

import jakarta.validation.constraints.Size;

public record UpdateTeamRequest(
        @Size(max = 100, message = "Team name must not exceed 100 characters")
        String name,

        String description,

        Boolean active
) {}
