package com.karenoganesian.civicflow.categories.api.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateCategoryRequest(
        @NotBlank(message = "Category name is required")
        @Size(max = 100, message = "Name must not exceed 100 characters")
        String name,

        @NotBlank(message = "Slug is required")
        @Size(max = 100, message = "Slug must not exceed 100 characters")
        String slug,

        String description,

        @Min(value = 1, message = "Default SLA hours must be at least 1")
        Integer defaultSlaHours,

        Boolean active
) {}
