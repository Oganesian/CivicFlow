package com.karenoganesian.civicflow.security;

import com.karenoganesian.civicflow.categories.domain.Category;
import com.karenoganesian.civicflow.issues.api.dto.PublicIssueResponse;
import com.karenoganesian.civicflow.issues.api.dto.PublicTimelineItemDto;
import com.karenoganesian.civicflow.issues.domain.Issue;
import com.karenoganesian.civicflow.issues.domain.IssueStatus;
import com.karenoganesian.civicflow.issues.domain.Priority;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

class PublicDataBoundaryTest {

    @Test
    @DisplayName("PublicIssueResponse must never leak reporter email or internal sensitive properties")
    void testPublicDataBoundaryOmission() {
        Category category = new Category(
                UUID.randomUUID(),
                "Street Lighting",
                "street-lighting",
                "Street lighting issues",
                24,
                true
        );

        Issue issue = new Issue(
                UUID.randomUUID(),
                "CF-2026-00999",
                "Broken Lamp Post",
                "The light on the corner is broken",
                category,
                IssueStatus.IN_PROGRESS,
                Priority.HIGH,
                "private.citizen@example.test",
                "Main Street 10",
                52.52,
                13.40,
                "Mitte"
        );

        List<PublicTimelineItemDto> timeline = List.of(
                new PublicTimelineItemDto("Received", "Report accepted", "NEW", Instant.now())
        );

        PublicIssueResponse publicDto = PublicIssueResponse.from(issue, timeline);

        assertThat(publicDto.referenceCode()).isEqualTo("CF-2026-00999");
        assertThat(publicDto.title()).isEqualTo("Broken Lamp Post");
        assertThat(publicDto.category().slug()).isEqualTo("street-lighting");
        assertThat(publicDto.status()).isEqualTo(IssueStatus.IN_PROGRESS);

        // Reflection check: PublicIssueResponse record has no reporterEmail component
        boolean hasReporterEmailField = false;
        for (var component : PublicIssueResponse.class.getRecordComponents()) {
            if (component.getName().toLowerCase().contains("email")) {
                hasReporterEmailField = true;
                break;
            }
        }
        assertThat(hasReporterEmailField).isFalse();
    }
}
