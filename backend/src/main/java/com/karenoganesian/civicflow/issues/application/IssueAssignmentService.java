package com.karenoganesian.civicflow.issues.application;

import com.karenoganesian.civicflow.audit.application.AuditEventService;
import com.karenoganesian.civicflow.audit.domain.IssueEventType;
import com.karenoganesian.civicflow.common.InvalidStateTransitionException;
import com.karenoganesian.civicflow.common.ResourceNotFoundException;
import com.karenoganesian.civicflow.issues.api.dto.AssignIssueRequest;
import com.karenoganesian.civicflow.issues.domain.Issue;
import com.karenoganesian.civicflow.issues.domain.IssueStatus;
import com.karenoganesian.civicflow.issues.persistence.IssueRepository;
import com.karenoganesian.civicflow.security.UserPrincipal;
import com.karenoganesian.civicflow.teams.domain.Team;
import com.karenoganesian.civicflow.teams.persistence.TeamRepository;
import com.karenoganesian.civicflow.users.domain.User;
import com.karenoganesian.civicflow.users.persistence.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class IssueAssignmentService {

    private final IssueRepository issueRepository;
    private final TeamRepository teamRepository;
    private final UserRepository userRepository;
    private final AuditEventService auditEventService;

    public IssueAssignmentService(
            IssueRepository issueRepository,
            TeamRepository teamRepository,
            UserRepository userRepository,
            AuditEventService auditEventService) {
        this.issueRepository = issueRepository;
        this.teamRepository = teamRepository;
        this.userRepository = userRepository;
        this.auditEventService = auditEventService;
    }

    @Transactional
    public Issue assignIssue(UUID issueId, AssignIssueRequest request, UserPrincipal currentPrincipal) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found with id: " + issueId));

        if (issue.getStatus() == IssueStatus.NEW) {
            throw new InvalidStateTransitionException("Issue must be triaged before it can be assigned to a team.");
        }
        if (issue.getStatus() == IssueStatus.REJECTED || issue.getStatus() == IssueStatus.CLOSED) {
            throw new InvalidStateTransitionException("Cannot reassign a closed or rejected issue.");
        }

        Team team = teamRepository.findById(request.teamId())
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with id: " + request.teamId()));

        if (!team.isActive()) {
            throw new IllegalArgumentException("Cannot assign to an inactive team");
        }

        User assignee = null;
        if (request.userId() != null) {
            assignee = userRepository.findById(request.userId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.userId()));

            if (assignee.getTeam() == null || !assignee.getTeam().getId().equals(team.getId())) {
                throw new IllegalArgumentException("Assigned technician does not belong to the selected team (" + team.getName() + ")");
            }
            if (!assignee.isActive()) {
                throw new IllegalArgumentException("Assigned technician account is inactive");
            }
        }

        String prevAssignment = (issue.getAssignedTeam() != null ? issue.getAssignedTeam().getName() : "Unassigned")
                + (issue.getAssignedUser() != null ? " / " + issue.getAssignedUser().getDisplayName() : "");

        issue.setAssignedTeam(team);
        issue.setAssignedUser(assignee);

        if (issue.getStatus() == IssueStatus.TRIAGED) {
            issue.setStatus(IssueStatus.ASSIGNED);
        }

        Issue saved = issueRepository.save(issue);

        User actor = currentPrincipal != null ? userRepository.findById(currentPrincipal.getId()).orElse(null) : null;
        String newAssignment = team.getName() + (assignee != null ? " / " + assignee.getDisplayName() : "");

        auditEventService.recordEvent(
                saved,
                actor,
                IssueEventType.ASSIGNED,
                prevAssignment,
                newAssignment,
                String.format("{\"teamId\":\"%s\",\"userId\":%s}",
                        team.getId(),
                        assignee != null ? "\"" + assignee.getId() + "\"" : "null")
        );

        return saved;
    }
}
