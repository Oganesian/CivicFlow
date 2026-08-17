package com.karenoganesian.civicflow.issues.web;

import com.karenoganesian.civicflow.common.PagedResponse;
import com.karenoganesian.civicflow.issues.api.dto.CreateIssueRequest;
import com.karenoganesian.civicflow.issues.api.dto.PublicIssueResponse;
import com.karenoganesian.civicflow.issues.application.IssueService;
import com.karenoganesian.civicflow.issues.domain.IssueStatus;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public/issues")
@Tag(name = "Public Issues", description = "Public endpoints for residents to report and track municipal issues")
public class PublicIssueController {

    private final IssueService issueService;

    public PublicIssueController(IssueService issueService) {
        this.issueService = issueService;
    }

    @PostMapping
    @Operation(summary = "Submit a new public municipal service request")
    public ResponseEntity<PublicIssueResponse> createPublicIssue(@Valid @RequestBody CreateIssueRequest request) {
        PublicIssueResponse response = issueService.createPublicIssue(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{referenceCode}")
    @Operation(summary = "Get public issue details and timeline by tracking reference code")
    public ResponseEntity<PublicIssueResponse> getPublicIssue(@PathVariable String referenceCode) {
        return ResponseEntity.ok(issueService.getPublicIssueByReferenceCode(referenceCode));
    }

    @GetMapping
    @Operation(summary = "Search and browse public municipal issues with pagination and filters")
    public ResponseEntity<PagedResponse<PublicIssueResponse>> searchPublicIssues(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) IssueStatus status,
            @RequestParam(required = false) String district,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "createdAt,desc") String sort) {

        String[] sortParts = sort.split(",");
        String sortProp = sortParts[0];
        Sort.Direction direction = (sortParts.length > 1 && sortParts[1].equalsIgnoreCase("asc"))
                ? Sort.Direction.ASC : Sort.Direction.DESC;

        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortProp));
        return ResponseEntity.ok(issueService.searchPublicIssues(category, status, district, search, pageable));
    }
}
