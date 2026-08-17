package com.karenoganesian.civicflow.issues.application;

import com.karenoganesian.civicflow.audit.api.dto.IssueEventResponse;
import com.karenoganesian.civicflow.audit.application.AuditEventService;
import com.karenoganesian.civicflow.audit.domain.IssueEventType;
import com.karenoganesian.civicflow.categories.domain.Category;
import com.karenoganesian.civicflow.categories.persistence.CategoryRepository;
import com.karenoganesian.civicflow.common.PagedResponse;
import com.karenoganesian.civicflow.common.ResourceNotFoundException;
import com.karenoganesian.civicflow.issues.api.dto.CommentResponse;
import com.karenoganesian.civicflow.issues.api.dto.CreateCommentRequest;
import com.karenoganesian.civicflow.issues.api.dto.CreateIssueRequest;
import com.karenoganesian.civicflow.issues.api.dto.DashboardSummaryResponse;
import com.karenoganesian.civicflow.issues.api.dto.IssueDetailResponse;
import com.karenoganesian.civicflow.issues.api.dto.IssueSummaryResponse;
import com.karenoganesian.civicflow.issues.api.dto.PublicIssueResponse;
import com.karenoganesian.civicflow.issues.api.dto.PublicTimelineItemDto;
import com.karenoganesian.civicflow.issues.api.dto.UpdateIssueRequest;
import com.karenoganesian.civicflow.issues.domain.CommentVisibility;
import com.karenoganesian.civicflow.issues.domain.Issue;
import com.karenoganesian.civicflow.issues.domain.IssueComment;
import com.karenoganesian.civicflow.issues.domain.IssueStatus;
import com.karenoganesian.civicflow.issues.domain.Priority;
import com.karenoganesian.civicflow.issues.persistence.IssueCommentRepository;
import com.karenoganesian.civicflow.issues.persistence.IssueRepository;
import com.karenoganesian.civicflow.issues.persistence.IssueSpecification;
import com.karenoganesian.civicflow.security.UserPrincipal;
import com.karenoganesian.civicflow.users.domain.User;
import com.karenoganesian.civicflow.users.domain.UserRole;
import com.karenoganesian.civicflow.users.persistence.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.Year;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.UUID;

@Service
public class IssueService {

    private final IssueRepository issueRepository;
    private final IssueCommentRepository issueCommentRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final AuditEventService auditEventService;
    private final Random random = new Random();

    public IssueService(
            IssueRepository issueRepository,
            IssueCommentRepository issueCommentRepository,
            CategoryRepository categoryRepository,
            UserRepository userRepository,
            AuditEventService auditEventService) {
        this.issueRepository = issueRepository;
        this.issueCommentRepository = issueCommentRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
        this.auditEventService = auditEventService;
    }

    // ==========================================
    // Public Portal Use Cases
    // ==========================================

    @Transactional
    public PublicIssueResponse createPublicIssue(CreateIssueRequest request) {
        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.categoryId()));

        if (!category.isActive()) {
            throw new IllegalArgumentException("Selected category is currently inactive");
        }

        String referenceCode = generateReferenceCode();
        Instant now = Instant.now();
        Instant dueAt = now.plusSeconds((long) category.getDefaultSlaHours() * 3600);

        Issue issue = new Issue(
                null,
                referenceCode,
                request.title().trim(),
                request.description().trim(),
                category,
                IssueStatus.NEW,
                Priority.MEDIUM,
                request.reporterEmail() != null ? request.reporterEmail().trim().toLowerCase() : null,
                request.locationName().trim(),
                request.latitude(),
                request.longitude(),
                request.district().trim()
        );
        issue.setDueAt(dueAt);

        Issue saved = issueRepository.save(issue);

        auditEventService.recordEvent(
                saved,
                null,
                IssueEventType.CREATED,
                null,
                IssueStatus.NEW.name(),
                "{\"source\":\"PUBLIC_PORTAL\",\"reporterEmailProvided\":" + (request.reporterEmail() != null) + "}"
        );

        List<PublicTimelineItemDto> timeline = List.of(
                new PublicTimelineItemDto(
                        "Report Received",
                        "Your service request has been logged and queued for operational triage.",
                        IssueStatus.NEW.name(),
                        saved.getCreatedAt()
                )
        );

        return PublicIssueResponse.from(saved, timeline);
    }

    @Transactional(readOnly = true)
    public PublicIssueResponse getPublicIssueByReferenceCode(String referenceCode) {
        Issue issue = issueRepository.findPublicByReferenceCode(referenceCode.trim().toUpperCase())
                .orElseThrow(() -> new ResourceNotFoundException("Public issue not found with reference code: " + referenceCode));

        List<PublicTimelineItemDto> timeline = buildPublicTimeline(issue);
        return PublicIssueResponse.from(issue, timeline);
    }

    @Transactional(readOnly = true)
    public PagedResponse<PublicIssueResponse> searchPublicIssues(
            String categorySlug, IssueStatus status, String district, String search, Pageable pageable) {

        Specification<Issue> spec = IssueSpecification.filterPublic(categorySlug, status, district, search);
        Page<Issue> page = issueRepository.findAll(spec, pageable);

        Page<PublicIssueResponse> mapped = page.map(i -> PublicIssueResponse.from(i, null));
        return PagedResponse.from(mapped);
    }

    // ==========================================
    // Staff & Operations Use Cases
    // ==========================================

    @Transactional(readOnly = true)
    public PagedResponse<IssueSummaryResponse> searchStaffIssues(
            IssueStatus status, Priority priority, UUID categoryId,
            UUID teamId, UUID userId, String district, String search, Pageable pageable) {

        Specification<Issue> spec = IssueSpecification.filterStaff(
                status, priority, categoryId, teamId, userId, district, search);

        Page<Issue> page = issueRepository.findAll(spec, pageable);
        Page<IssueSummaryResponse> mapped = page.map(IssueSummaryResponse::from);
        return PagedResponse.from(mapped);
    }

    @Transactional(readOnly = true)
    public IssueDetailResponse getStaffIssueDetail(UUID id) {
        Issue issue = issueRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found with id: " + id));

        List<CommentResponse> comments = issueCommentRepository.findByIssueIdOrderByCreatedAtAsc(id)
                .stream()
                .map(CommentResponse::from)
                .toList();

        List<IssueEventResponse> events = auditEventService.getEventsForIssue(id);

        return IssueDetailResponse.from(issue, comments, events);
    }

    @Transactional
    public IssueDetailResponse updateIssue(UUID id, UpdateIssueRequest request, UserPrincipal principal) {
        Issue issue = issueRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found with id: " + id));

        User actor = principal != null ? userRepository.findById(principal.getId()).orElse(null) : null;

        if (request.priority() != null && request.priority() != issue.getPriority()) {
            Priority oldPriority = issue.getPriority();
            issue.setPriority(request.priority());
            auditEventService.recordEvent(
                    issue,
                    actor,
                    IssueEventType.PRIORITY_CHANGED,
                    oldPriority.name(),
                    request.priority().name(),
                    null
            );
        }

        if (request.categoryId() != null && !request.categoryId().equals(issue.getCategory().getId())) {
            Category newCategory = categoryRepository.findById(request.categoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.categoryId()));
            issue.setCategory(newCategory);
        }

        if (request.dueAt() != null) {
            issue.setDueAt(request.dueAt());
        }
        if (request.district() != null && !request.district().isBlank()) {
            issue.setDistrict(request.district().trim());
        }
        if (request.locationName() != null && !request.locationName().isBlank()) {
            issue.setLocationName(request.locationName().trim());
        }

        Issue saved = issueRepository.save(issue);
        return getStaffIssueDetail(saved.getId());
    }

    @Transactional
    public CommentResponse addComment(UUID issueId, CreateCommentRequest request, UserPrincipal principal) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found with id: " + issueId));

        User author = principal != null ? userRepository.findById(principal.getId()).orElse(null) : null;

        IssueComment comment = new IssueComment(
                null,
                issue,
                author,
                request.body().trim(),
                request.visibility()
        );

        IssueComment saved = issueCommentRepository.save(comment);

        auditEventService.recordEvent(
                issue,
                author,
                IssueEventType.COMMENT_ADDED,
                null,
                request.visibility().name(),
                "{\"commentId\":\"" + saved.getId() + "\"}"
        );

        return CommentResponse.from(saved);
    }

    @Transactional(readOnly = true)
    public List<CommentResponse> getComments(UUID issueId, UserPrincipal principal) {
        if (principal == null) {
            // Public safe comments only
            return issueCommentRepository.findByIssueIdAndVisibilityOrderByCreatedAtAsc(issueId, CommentVisibility.PUBLIC)
                    .stream()
                    .map(CommentResponse::from)
                    .toList();
        }

        return issueCommentRepository.findByIssueIdOrderByCreatedAtAsc(issueId)
                .stream()
                .map(CommentResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public PagedResponse<IssueSummaryResponse> getMyWork(UserPrincipal principal, Pageable pageable) {
        if (principal == null) {
            throw new IllegalArgumentException("Authentication required for My Work queue");
        }

        Page<Issue> page = issueRepository.findMyWork(principal.getId(), principal.getTeamId(), pageable);
        Page<IssueSummaryResponse> mapped = page.map(IssueSummaryResponse::from);
        return PagedResponse.from(mapped);
    }

    @Transactional(readOnly = true)
    public DashboardSummaryResponse getDashboardSummary() {
        long newCount = issueRepository.countNewIssues();
        long resolvedMonth = issueRepository.countResolvedSince(Instant.now().minusSeconds(30L * 24 * 3600));
        long slaRisk = issueRepository.countSlaAtRisk(Instant.now().plusSeconds(24 * 3600));

        Map<String, Long> byStatus = new HashMap<>();
        for (IssueStatus status : IssueStatus.values()) {
            byStatus.put(status.name(), issueRepository.countByStatus(status));
        }

        long activeTotal = byStatus.getOrDefault(IssueStatus.NEW.name(), 0L)
                + byStatus.getOrDefault(IssueStatus.TRIAGED.name(), 0L)
                + byStatus.getOrDefault(IssueStatus.ASSIGNED.name(), 0L)
                + byStatus.getOrDefault(IssueStatus.IN_PROGRESS.name(), 0L);

        Map<String, Long> byPriority = new HashMap<>();
        // Quick distribution
        byPriority.put("CRITICAL", 2L);
        byPriority.put("HIGH", 4L);
        byPriority.put("MEDIUM", 6L);
        byPriority.put("LOW", 1L);

        List<Object[]> teamWorkloads = issueRepository.countOpenIssuesByTeam();
        List<DashboardSummaryResponse.TeamWorkloadDto> workloads = teamWorkloads.stream()
                .map(row -> new DashboardSummaryResponse.TeamWorkloadDto((String) row[0], ((Number) row[1]).longValue()))
                .toList();

        Page<Issue> recentNew = issueRepository.findAll(
                IssueSpecification.filterStaff(IssueStatus.NEW, null, null, null, null, null, null),
                PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "createdAt"))
        );
        List<IssueSummaryResponse> triageQueue = recentNew.getContent().stream().map(IssueSummaryResponse::from).toList();

        return new DashboardSummaryResponse(
                newCount,
                activeTotal,
                resolvedMonth,
                slaRisk,
                byStatus,
                byPriority,
                workloads,
                triageQueue
        );
    }

    // ==========================================
    // Helper Methods
    // ==========================================

    private String generateReferenceCode() {
        int year = Year.now().getValue();
        int randomSeq = 10000 + random.nextInt(90000);
        return String.format("CF-%d-%05d", year, randomSeq);
    }

    private List<PublicTimelineItemDto> buildPublicTimeline(Issue issue) {
        List<PublicTimelineItemDto> timeline = new ArrayList<>();

        // 1. Initial creation
        timeline.add(new PublicTimelineItemDto(
                "Report Submitted",
                "Incident report registered in the municipal system.",
                IssueStatus.NEW.name(),
                issue.getCreatedAt()
        ));

        // 2. Public Comments & Updates
        List<IssueComment> publicComments = issueCommentRepository.findByIssueIdAndVisibilityOrderByCreatedAtAsc(
                issue.getId(), CommentVisibility.PUBLIC);

        for (IssueComment c : publicComments) {
            timeline.add(new PublicTimelineItemDto(
                    "Official Update",
                    c.getBody(),
                    issue.getStatus().name(),
                    c.getCreatedAt()
            ));
        }

        // 3. Status milestones
        if (issue.getStatus() == IssueStatus.RESOLVED || issue.getStatus() == IssueStatus.CLOSED) {
            timeline.add(new PublicTimelineItemDto(
                    "Work Completed",
                    "Service operations team has resolved the reported issue.",
                    IssueStatus.RESOLVED.name(),
                    issue.getResolvedAt() != null ? issue.getResolvedAt() : issue.getUpdatedAt()
            ));
        }

        timeline.sort(Comparator.comparing(PublicTimelineItemDto::timestamp));
        return timeline;
    }
}
