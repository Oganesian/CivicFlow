package com.karenoganesian.civicflow.issues.persistence;

import com.karenoganesian.civicflow.issues.domain.CommentVisibility;
import com.karenoganesian.civicflow.issues.domain.IssueComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface IssueCommentRepository extends JpaRepository<IssueComment, UUID> {
    List<IssueComment> findByIssueIdOrderByCreatedAtAsc(UUID issueId);
    List<IssueComment> findByIssueIdAndVisibilityOrderByCreatedAtAsc(UUID issueId, CommentVisibility visibility);
}
