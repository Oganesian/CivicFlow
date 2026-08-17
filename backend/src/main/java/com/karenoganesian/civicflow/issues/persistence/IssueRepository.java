package com.karenoganesian.civicflow.issues.persistence;

import com.karenoganesian.civicflow.issues.domain.Issue;
import com.karenoganesian.civicflow.issues.domain.IssueStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface IssueRepository extends JpaRepository<Issue, UUID>, JpaSpecificationExecutor<Issue> {

    Optional<Issue> findByReferenceCode(String referenceCode);

    @Query("SELECT i FROM Issue i WHERE i.referenceCode = :refCode AND i.status != 'REJECTED'")
    Optional<Issue> findPublicByReferenceCode(@Param("refCode") String refCode);

    @Query("SELECT i FROM Issue i WHERE i.status != 'REJECTED'")
    Page<Issue> findPublicIssues(Pageable pageable);

    @Query("SELECT i FROM Issue i WHERE (:userId IS NULL OR i.assignedUser.id = :userId) OR (i.assignedUser IS NULL AND i.assignedTeam.id = :teamId)")
    Page<Issue> findMyWork(@Param("userId") UUID userId, @Param("teamId") UUID teamId, Pageable pageable);

    long countByStatus(IssueStatus status);

    @Query("SELECT COUNT(i) FROM Issue i WHERE i.status = 'NEW'")
    long countNewIssues();

    @Query("SELECT COUNT(i) FROM Issue i WHERE i.status IN ('RESOLVED', 'CLOSED') AND i.resolvedAt >= :since")
    long countResolvedSince(@Param("since") Instant since);

    @Query("SELECT COUNT(i) FROM Issue i WHERE i.status NOT IN ('RESOLVED', 'CLOSED', 'REJECTED') AND i.dueAt IS NOT NULL AND i.dueAt < :timeThreshold")
    long countSlaAtRisk(@Param("timeThreshold") Instant timeThreshold);

    @Query("SELECT i.assignedTeam.name, COUNT(i) FROM Issue i WHERE i.assignedTeam IS NOT NULL AND i.status NOT IN ('RESOLVED', 'CLOSED', 'REJECTED') GROUP BY i.assignedTeam.name")
    List<Object[]> countOpenIssuesByTeam();
}
