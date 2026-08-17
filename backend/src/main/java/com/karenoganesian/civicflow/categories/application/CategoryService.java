package com.karenoganesian.civicflow.categories.application;

import com.karenoganesian.civicflow.categories.api.dto.CategoryResponse;
import com.karenoganesian.civicflow.categories.api.dto.CreateCategoryRequest;
import com.karenoganesian.civicflow.categories.api.dto.UpdateCategoryRequest;
import com.karenoganesian.civicflow.categories.domain.Category;
import com.karenoganesian.civicflow.categories.persistence.CategoryRepository;
import com.karenoganesian.civicflow.common.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> getPublicActiveCategories() {
        return categoryRepository.findByActiveTrueOrderByNameAsc()
                .stream()
                .map(CategoryResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAllByOrderByNameAsc()
                .stream()
                .map(CategoryResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public Category getCategoryEntity(UUID id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
    }

    @Transactional
    public CategoryResponse createCategory(CreateCategoryRequest request) {
        if (categoryRepository.existsBySlugIgnoreCase(request.slug())) {
            throw new IllegalArgumentException("A category with slug '" + request.slug() + "' already exists");
        }

        Category category = new Category(
                null,
                request.name(),
                request.slug().toLowerCase().trim(),
                request.description(),
                request.defaultSlaHours() != null ? request.defaultSlaHours() : 48,
                request.active() != null ? request.active() : true
        );

        return CategoryResponse.from(categoryRepository.save(category));
    }

    @Transactional
    public CategoryResponse updateCategory(UUID id, UpdateCategoryRequest request) {
        Category category = getCategoryEntity(id);

        if (request.name() != null && !request.name().isBlank()) {
            category.setName(request.name().trim());
        }
        if (request.description() != null) {
            category.setDescription(request.description());
        }
        if (request.defaultSlaHours() != null) {
            category.setDefaultSlaHours(request.defaultSlaHours());
        }
        if (request.active() != null) {
            category.setActive(request.active());
        }

        return CategoryResponse.from(categoryRepository.save(category));
    }
}
