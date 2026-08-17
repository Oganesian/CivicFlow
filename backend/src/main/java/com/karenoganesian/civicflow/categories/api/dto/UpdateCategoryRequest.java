package com.karenoganesian.civicflow.categories.api.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

public record UpdateCategoryRequest(
        @Size(max = 100, message = "Name must not exceed 100 characters")
        String name,

        String description,

        @Min(value = 1, message = "Default SLA hours must be at least 1")
        Integer defaultSlaHours,

        Boolean active
) {}
