package com.karenoganesian.civicflow.issues.domain;

public enum IssueStatus {
    NEW,
    TRIAGED,
    ASSIGNED,
    IN_PROGRESS,
    RESOLVED,
    CLOSED,
    REJECTED;

    public boolean isTerminal() {
        return this == CLOSED || this == REJECTED;
    }

    public boolean isPubliclyVisible() {
        return this != REJECTED;
    }
}
