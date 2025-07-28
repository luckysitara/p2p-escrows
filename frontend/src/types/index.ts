export enum MilestoneStatus {
  Upcoming = "Upcoming",
  Funded = "Funded",
  Completed = "Completed",
  Cancelled = "Cancelled",
  Expired = "Expired",
}

export enum ProjectStatus {
  Active = "Active",
  Completed = "Completed",
  Cancelled = "Cancelled",
  OnHold = "OnHold",
}

export interface Milestone {
  id: string
  title: string
  description?: string
  amount: number
  status: MilestoneStatus
  escrowAccount: string | null
  fundedAt?: string
  completedAt?: string
  dueDate?: string
  requirements?: string[]
}

export interface Project {
  id: string
  title: string
  description?: string
  clientAddress: string
  freelancerAddress: string
  milestones: Milestone[]
  status: ProjectStatus
  createdAt: string
  updatedAt: string
  totalAmount: number
  completedAmount: number
  fundedAmount: number
  tags?: string[]
  category?: string
  priority?: "low" | "medium" | "high"
}

export interface User {
  address: string
  name?: string
  email?: string
  avatar?: string
  bio?: string
  skills?: string[]
  rating?: number
  totalProjects?: number
  completedProjects?: number
  totalEarnings?: number
  joinedAt: string
}

export interface Notification {
  id: string
  type: "milestone_funded" | "milestone_completed" | "payment_claimed" | "project_created" | "dispute_raised"
  title: string
  message: string
  read: boolean
  createdAt: string
  projectId?: string
  milestoneId?: string
  actionUrl?: string
}

export interface EscrowData {
  address: string
  seed: number
  maker: string
  mintA: string
  mintB: string
  receiveAmount: number
  expiry: number
  isMutable: boolean
  createdAt: string
}

export interface ProjectStats {
  totalProjects: number
  activeProjects: number
  completedProjects: number
  totalValue: number
  completedValue: number
  pendingValue: number
}

export interface WalletBalance {
  sol: number
  tokens: TokenBalance[]
}

export interface TokenBalance {
  mint: string
  amount: number
  decimals: number
  symbol?: string
  name?: string
}

export interface TransactionHistory {
  signature: string
  type: "fund" | "claim" | "refund" | "update"
  amount: number
  timestamp: string
  status: "success" | "failed" | "pending"
  projectId: string
  milestoneId: string
}

export interface NotificationSettings {
  emailNotifications: boolean
  pushNotifications: boolean
  milestoneUpdates: boolean
  paymentAlerts: boolean
  projectInvites: boolean
}

export interface UserProfile {
  address: string
  name?: string
  email?: string
  avatar?: string
  bio?: string
  skills?: string[]
  rating?: number
  completedProjects: number
  totalEarnings: number
  joinedAt: string
  isVerified: boolean
  notificationSettings: NotificationSettings
}

// Form types
export interface CreateProjectForm {
  title: string
  description?: string
  freelancerAddress: string
  milestones: Omit<Milestone, "id" | "status" | "escrowAccount">[]
  category?: string
  tags?: string[]
  priority?: "low" | "medium" | "high"
}

export interface UpdateProjectForm {
  title?: string
  description?: string
  status?: ProjectStatus
  deadline?: string
  requirements?: string[]
}

export interface CreateMilestoneForm {
  title: string
  description?: string
  amount: number
  dueDate?: string
  requirements?: string[]
  deliverables?: string[]
}

export interface UpdateMilestoneForm {
  title?: string
  description?: string
  amount?: number
  dueDate?: string
  requirements?: string[]
}

// Utility types
export type ProjectRole = "client" | "freelancer" | "observer"
export type ViewMode = "grid" | "list"
export type SortOrder = "asc" | "desc"
export type SortField = "createdAt" | "updatedAt" | "totalAmount" | "title" | "status"

export interface SortConfig {
  field: SortField
  order: SortOrder
}

// Error types
export interface AppError {
  code: string
  message: string
  details?: any
}

// Theme types
export interface ThemeConfig {
  mode: "light" | "dark" | "system"
  primaryColor: string
  accentColor: string
}

// Settings types
export interface UserSettings {
  theme: ThemeConfig
  notifications: {
    email: boolean
    push: boolean
    milestoneUpdates: boolean
    paymentAlerts: boolean
    projectUpdates: boolean
  }
  privacy: {
    showProfile: boolean
    showStats: boolean
    showProjects: boolean
  }
  preferences: {
    defaultViewMode: ViewMode
    itemsPerPage: number
    autoRefresh: boolean
    soundEffects: boolean
  }
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

// Filter and search types
export interface ProjectFilters {
  status?: ProjectStatus[]
  category?: string[]
  minAmount?: number
  maxAmount?: number
  dateRange?: {
    start: string
    end: string
  }
  tags?: string[]
  priority?: ("low" | "medium" | "high")[]
}

export interface SearchOptions {
  query: string
  filters: ProjectFilters
  sortBy: "createdAt" | "updatedAt" | "totalAmount" | "title"
  sortOrder: "asc" | "desc"
  page: number
  limit: number
}
