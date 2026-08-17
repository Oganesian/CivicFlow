package com.karenoganesian.civicflow.issues.persistence;

import com.karenoganesian.civicflow.issues.domain.Issue;
import com.karenoganesian.civicflow.issues.domain.IssueStatus;
import com.karenoganesian.civicflow.issues.domain.Priority;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public final class IssueSpecification {

    private IssueSpecification() {}

    public static Specification<Issue> filterPublic(String categorySlug, IssueStatus status, String district, String search) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.notEqual(root.get("status"), IssueStatus.REJECTED));

            if (categorySlug != null && !categorySlug.isBlank()) {
                predicates.add(cb.equal(cb.lower(root.get("category").get("slug")), categorySlug.toLowerCase()));
            }
            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }
            if (district != null && !district.isBlank()) {
                predicates.add(cb.equal(cb.lower(root.get("district")), district.toLowerCase()));
            }
            if (search != null && !search.isBlank()) {
                String pattern = "%" + search.toLowerCase() + "%";
                Predicate titleMatch = cb.like(cb.lower(root.get("title")), pattern);
                Predicate descMatch = cb.like(cb.lower(root.get("description")), pattern);
                Predicate locMatch = cb.like(cb.lower(root.get("locationName")), pattern);
                Predicate refMatch = cb.like(cb.lower(root.get("referenceCode")), pattern);
                predicates.add(cb.or(titleMatch, descMatch, locMatch, refMatch));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    public static Specification<Issue> filterStaff(
            IssueStatus status, Priority priority, UUID categoryId,
            UUID teamId, UUID userId, String district, String search) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }
            if (priority != null) {
                predicates.add(cb.equal(root.get("priority"), priority));
            }
            if (categoryId != null) {
                predicates.add(cb.equal(root.get("category").get("id"), categoryId));
            }
            if (teamId != null) {
                predicates.add(cb.equal(root.get("assignedTeam").get("id"), teamId));
            }
            if (userId != null) {
                predicates.add(cb.equal(root.get("assignedUser").get("id"), userId));
            }
            if (district != null && !district.isBlank()) {
                predicates.add(cb.equal(cb.lower(root.get("district")), district.toLowerCase()));
            }
            if (search != null && !search.isBlank()) {
                String pattern = "%" + search.toLowerCase() + "%";
                Predicate titleMatch = cb.like(cb.lower(root.get("title")), pattern);
                Predicate descMatch = cb.like(cb.lower(root.get("description")), pattern);
                Predicate locMatch = cb.like(cb.lower(root.get("locationName")), pattern);
                Predicate refMatch = cb.like(cb.lower(root.get("referenceCode")), pattern);
                predicates.add(cb.or(titleMatch, descMatch, locMatch, refMatch));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
