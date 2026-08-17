package com.karenoganesian.civicflow.users.api.dto;

public record AuthResponse(
        String token,
        UserResponse user
) {}
