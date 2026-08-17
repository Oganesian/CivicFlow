package com.karenoganesian.civicflow.categories.api.dto;

import com.karenoganesian.civicflow.categories.domain.Category;

import java.util.UUID;

public record CategoryResponse(
        UUID id,
        String name,
        String slug,
        String description,
        int defaultSlaHours,
        boolean active
) {
    public static CategoryResponse from(Category category) {
        return new CategoryResponse(
                category.getId(),
                category.getName(),
                category.getSlug(),
                category.getDescription(),
                category.getDefaultSlaHours(),
                category.isActive()
        );
    }
}
