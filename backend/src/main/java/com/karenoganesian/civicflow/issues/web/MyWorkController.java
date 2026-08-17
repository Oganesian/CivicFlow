package com.karenoganesian.civicflow.issues.web;

import com.karenoganesian.civicflow.common.PagedResponse;
import com.karenoganesian.civicflow.issues.api.dto.IssueSummaryResponse;
import com.karenoganesian.civicflow.issues.application.IssueService;
import com.karenoganesian.civicflow.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/my-work")
@PreAuthorize("hasAnyRole('TECHNICIAN', 'DISPATCHER', 'ADMIN')")
@Tag(name = "My Work", description = "Personal work queue for technicians and team assignments")
public class MyWorkController {

    private final IssueService issueService;

    public MyWorkController(IssueService issueService) {
        this.issueService = issueService;
    }

    @GetMapping
    @Operation(summary = "Get issues assigned directly to the current technician or their service team")
    public ResponseEntity<PagedResponse<IssueSummaryResponse>> getMyWork(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "dueAt,asc") String sort) {

        String[] sortParts = sort.split(",");
        String sortProp = sortParts[0];
        Sort.Direction direction = (sortParts.length > 1 && sortParts[1].equalsIgnoreCase("desc"))
                ? Sort.Direction.DESC : Sort.Direction.ASC;

        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortProp));
        return ResponseEntity.ok(issueService.getMyWork(principal, pageable));
    }
}
