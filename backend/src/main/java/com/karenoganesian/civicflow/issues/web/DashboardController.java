package com.karenoganesian.civicflow.issues.web;

import com.karenoganesian.civicflow.issues.api.dto.DashboardSummaryResponse;
import com.karenoganesian.civicflow.issues.application.IssueService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@PreAuthorize("hasAnyRole('DISPATCHER', 'TECHNICIAN', 'ADMIN')")
@Tag(name = "Dashboard", description = "Operational metrics, triage queues, SLA warnings, and workload summaries")
public class DashboardController {

    private final IssueService issueService;

    public DashboardController(IssueService issueService) {
        this.issueService = issueService;
    }

    @GetMapping("/summary")
    @Operation(summary = "Get operations dashboard summary and metrics")
    public ResponseEntity<DashboardSummaryResponse> getSummary() {
        return ResponseEntity.ok(issueService.getDashboardSummary());
    }
}
