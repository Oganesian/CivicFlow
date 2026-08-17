import axios from 'axios';
import {
  AuthResponse,
  Category,
  DashboardSummary,
  IssueDetail,
  IssueSummary,
  PagedResponse,
  PublicIssue,
  Team,
  User,
  IssueStatus,
  Priority,
  CommentVisibility,
} from './types';

export const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Intercept request to add Authorization header from local storage if present
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('civicflow_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Public API
export const publicApi = {
  getCategories: async (): Promise<Category[]> => {
    const res = await apiClient.get<Category[]>('/public/categories');
    return res.data;
  },

  createIssue: async (data: {
    categoryId: string;
    title: string;
    description: string;
    locationName: string;
    latitude?: number;
    longitude?: number;
    district: string;
    reporterEmail?: string;
  }): Promise<PublicIssue> => {
    const res = await apiClient.post<PublicIssue>('/public/issues', data);
    return res.data;
  },

  getIssueByReference: async (referenceCode: string): Promise<PublicIssue> => {
    const res = await apiClient.get<PublicIssue>(`/public/issues/${referenceCode}`);
    return res.data;
  },

  searchIssues: async (params: {
    category?: string;
    status?: IssueStatus;
    district?: string;
    search?: string;
    page?: number;
    size?: number;
    sort?: string;
  }): Promise<PagedResponse<PublicIssue>> => {
    const res = await apiClient.get<PagedResponse<PublicIssue>>('/public/issues', { params });
    return res.data;
  },
};

// Auth API
export const authApi = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>('/auth/login', { email, password });
    return res.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  getMe: async (): Promise<User> => {
    const res = await apiClient.get<User>('/auth/me');
    return res.data;
  },
};

// Staff Operations API
export const staffApi = {
  getDashboardSummary: async (): Promise<DashboardSummary> => {
    const res = await apiClient.get<DashboardSummary>('/dashboard/summary');
    return res.data;
  },

  searchIssues: async (params: {
    status?: IssueStatus;
    priority?: Priority;
    categoryId?: string;
    teamId?: string;
    userId?: string;
    district?: string;
    search?: string;
    page?: number;
    size?: number;
    sort?: string;
  }): Promise<PagedResponse<IssueSummary>> => {
    const res = await apiClient.get<PagedResponse<IssueSummary>>('/issues', { params });
    return res.data;
  },

  getIssueDetail: async (id: string): Promise<IssueDetail> => {
    const res = await apiClient.get<IssueDetail>(`/issues/${id}`);
    return res.data;
  },

  updateIssue: async (
    id: string,
    data: {
      priority?: Priority;
      categoryId?: string;
      dueAt?: string;
      district?: string;
      locationName?: string;
    }
  ): Promise<IssueDetail> => {
    const res = await apiClient.patch<IssueDetail>(`/issues/${id}`, data);
    return res.data;
  },

  assignIssue: async (
    id: string,
    data: { teamId: string; userId?: string | null }
  ): Promise<IssueDetail> => {
    const res = await apiClient.post<IssueDetail>(`/issues/${id}/assignments`, data);
    return res.data;
  },

  transitionStatus: async (
    id: string,
    data: {
      status: IssueStatus;
      publicMessage?: string;
      internalMessage?: string;
    }
  ): Promise<IssueDetail> => {
    const res = await apiClient.post<IssueDetail>(`/issues/${id}/status-transitions`, data);
    return res.data;
  },

  addComment: async (
    id: string,
    data: { body: string; visibility: CommentVisibility }
  ) => {
    const res = await apiClient.post(`/issues/${id}/comments`, data);
    return res.data;
  },

  getMyWork: async (params?: {
    page?: number;
    size?: number;
    sort?: string;
  }): Promise<PagedResponse<IssueSummary>> => {
    const res = await apiClient.get<PagedResponse<IssueSummary>>('/my-work', { params });
    return res.data;
  },

  getActiveTeams: async (): Promise<Team[]> => {
    const res = await apiClient.get<Team[]>('/teams');
    return res.data;
  },
};

// Admin API
export const adminApi = {
  getAllCategories: async (): Promise<Category[]> => {
    const res = await apiClient.get<Category[]>('/admin/categories');
    return res.data;
  },

  createCategory: async (data: Partial<Category>): Promise<Category> => {
    const res = await apiClient.post<Category>('/admin/categories', data);
    return res.data;
  },

  updateCategory: async (id: string, data: Partial<Category>): Promise<Category> => {
    const res = await apiClient.patch<Category>(`/admin/categories/${id}`, data);
    return res.data;
  },

  getAllTeams: async (): Promise<Team[]> => {
    const res = await apiClient.get<Team[]>('/admin/teams');
    return res.data;
  },

  createTeam: async (data: Partial<Team>): Promise<Team> => {
    const res = await apiClient.post<Team>('/admin/teams', data);
    return res.data;
  },

  updateTeam: async (id: string, data: Partial<Team>): Promise<Team> => {
    const res = await apiClient.patch<Team>(`/admin/teams/${id}`, data);
    return res.data;
  },

  getAllUsers: async (teamId?: string): Promise<User[]> => {
    const res = await apiClient.get<User[]>('/admin/users', { params: { teamId } });
    return res.data;
  },

  createUser: async (data: {
    email: string;
    displayName: string;
    password: string;
    role: string;
    teamId?: string;
  }): Promise<User> => {
    const res = await apiClient.post<User>('/admin/users', data);
    return res.data;
  },

  updateUser: async (id: string, data: Partial<User>): Promise<User> => {
    const res = await apiClient.patch<User>(`/admin/users/${id}`, data);
    return res.data;
  },
};
