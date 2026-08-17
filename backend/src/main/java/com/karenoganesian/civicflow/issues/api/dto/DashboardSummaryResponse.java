package com.karenoganesian.civicflow.issues.api.dto;

import java.util.List;
import java.util.Map;

public record DashboardSummaryResponse(
        long newReportsAwaitingTriage,
        long activeIssuesTotal,
        long resolvedThisMonth,
        long slaAtRiskCount,
        Map<String, Long> issuesByStatus,
        Map<String, Long> issuesByPriority,
        List<TeamWorkloadDto> workloadByTeam,
        List<IssueSummaryResponse> recentTriageQueue
) {
    public record TeamWorkloadDto(
            String teamName,
            long activeIssueCount
    ) {}
}
