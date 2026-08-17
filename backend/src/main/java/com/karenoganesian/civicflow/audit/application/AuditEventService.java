package com.karenoganesian.civicflow.audit.application;

import com.karenoganesian.civicflow.audit.api.dto.IssueEventResponse;
import com.karenoganesian.civicflow.audit.domain.IssueEvent;
import com.karenoganesian.civicflow.audit.domain.IssueEventType;
import com.karenoganesian.civicflow.audit.persistence.IssueEventRepository;
import com.karenoganesian.civicflow.issues.domain.Issue;
import com.karenoganesian.civicflow.users.domain.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class AuditEventService {

    private final IssueEventRepository issueEventRepository;

    public AuditEventService(IssueEventRepository issueEventRepository) {
        this.issueEventRepository = issueEventRepository;
    }

    @Transactional
    public void recordEvent(Issue issue, User actor, IssueEventType eventType,
                            String previousValue, String newValue, String metadataJson) {
        IssueEvent event = new IssueEvent(
                null,
                issue,
                actor,
                eventType,
                previousValue,
                newValue,
                metadataJson
        );
        issueEventRepository.save(event);
    }

    @Transactional(readOnly = true)
    public List<IssueEventResponse> getEventsForIssue(UUID issueId) {
        return issueEventRepository.findByIssueIdOrderByCreatedAtAsc(issueId)
                .stream()
                .map(IssueEventResponse::from)
                .toList();
    }
}
