export type IssueStatus =
  | 'NEW'
  | 'TRIAGED'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'RESOLVED'
  | 'CLOSED'
  | 'REJECTED';

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type UserRole = 'RESIDENT' | 'TECHNICIAN' | 'DISPATCHER' | 'ADMIN';

export type CommentVisibility = 'PUBLIC' | 'INTERNAL';

export type IssueEventType =
  | 'CREATED'
  | 'TRIAGED'
  | 'PRIORITY_CHANGED'
  | 'ASSIGNED'
  | 'STATUS_CHANGED'
  | 'COMMENT_ADDED'
  | 'ATTACHMENT_ADDED'
  | 'RESOLVED'
  | 'CLOSED';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  defaultSlaHours: number;
  active: boolean;
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  active: boolean;
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  teamId?: string | null;
  teamName?: string | null;
  active: boolean;
}

export interface PublicTimelineItem {
  title: string;
  message?: string;
  status: string;
  timestamp: string;
}

export interface PublicIssue {
  referenceCode: string;
  title: string;
  description: string;
  category: Category;
  status: IssueStatus;
  priority: Priority;
  locationName: string;
  latitude?: number | null;
  longitude?: number | null;
  district: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string | null;
  publicTimeline?: PublicTimelineItem[];
}

export interface IssueSummary {
  id: string;
  referenceCode: string;
  title: string;
  category: Category;
  status: IssueStatus;
  priority: Priority;
  locationName: string;
  district: string;
  assignedTeamId?: string | null;
  assignedTeamName?: string | null;
  assignedUserId?: string | null;
  assignedUserName?: string | null;
  dueAt?: string | null;
  createdAt: string;
  updatedAt: string;
  slaAtRisk: boolean;
}

export interface IssueComment {
  id: string;
  issueId: string;
  authorId?: string | null;
  authorName: string;
  body: string;
  visibility: CommentVisibility;
  createdAt: string;
}

export interface IssueEvent {
  id: string;
  issueId: string;
  actorId?: string | null;
  actorName: string;
  eventType: IssueEventType;
  previousValue?: string | null;
  newValue?: string | null;
  metadataJson?: string | null;
  createdAt: string;
}

export interface IssueDetail {
  id: string;
  referenceCode: string;
  title: string;
  description: string;
  category: Category;
  status: IssueStatus;
  priority: Priority;
  reporterEmail?: string | null;
  locationName: string;
  latitude?: number | null;
  longitude?: number | null;
  district: string;
  assignedTeamId?: string | null;
  assignedTeamName?: string | null;
  assignedUserId?: string | null;
  assignedUserName?: string | null;
  dueAt?: string | null;
  resolvedAt?: string | null;
  version: number;
  createdAt: string;
  updatedAt: string;
  comments: IssueComment[];
  events: IssueEvent[];
}

export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface DashboardSummary {
  newReportsAwaitingTriage: number;
  activeIssuesTotal: number;
  resolvedThisMonth: number;
  slaAtRiskCount: number;
  issuesByStatus: Record<string, number>;
  issuesByPriority: Record<string, number>;
  workloadByTeam: Array<{ teamName: string; activeIssueCount: number }>;
  recentTriageQueue: IssueSummary[];
}

export interface AuthResponse {
  token: string;
  user: User;
}
