package com.karenoganesian.civicflow.issues.domain;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class IssueStatusTransitionTest {

    @Test
    @DisplayName("IssueStatus terminal flags should correctly identify CLOSED and REJECTED")
    void testTerminalStatuses() {
        assertThat(IssueStatus.CLOSED.isTerminal()).isTrue();
        assertThat(IssueStatus.REJECTED.isTerminal()).isTrue();
        assertThat(IssueStatus.NEW.isTerminal()).isFalse();
        assertThat(IssueStatus.TRIAGED.isTerminal()).isFalse();
        assertThat(IssueStatus.ASSIGNED.isTerminal()).isFalse();
        assertThat(IssueStatus.IN_PROGRESS.isTerminal()).isFalse();
        assertThat(IssueStatus.RESOLVED.isTerminal()).isFalse();
    }

    @Test
    @DisplayName("IssueStatus public visibility should exclude REJECTED")
    void testPublicVisibility() {
        assertThat(IssueStatus.REJECTED.isPubliclyVisible()).isFalse();
        assertThat(IssueStatus.NEW.isPubliclyVisible()).isTrue();
        assertThat(IssueStatus.IN_PROGRESS.isPubliclyVisible()).isTrue();
        assertThat(IssueStatus.RESOLVED.isPubliclyVisible()).isTrue();
    }
}
