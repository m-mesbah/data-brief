// API Request/Response Types

export interface User {
  id: string;
  uid: string;
  email: string;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Organization {
  id: string;
  name: string;
  type: string;
  size: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Domain {
  id: string;
  name: string;
  siteId?: string;
  type: string;
  organizationId: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Platform {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Integration {
  id: string;
  domainId: string;
  platformId: string;
  platformName?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IntegrationAccount {
  id: string;
  name: string;
}

export interface ApiKey {
  id: string;
  domainId: string;
  key: string;
  createdAt?: string;
}

// Request Types
export interface SignUpRequest {
  email: string;
  name: string;
  phone: string;
  organization_name: string;
  organization_type: string;
  organization_size: string;
}

export interface LoginRequest {
  email: string;
}

export interface CreateOrganizationRequest {
  name: string;
  type: string;
  size: string;
}

export interface UpdateOrganizationRequest {
  name: string;
  type: string;
  size: string;
}

export interface CreateDomainRequest {
  name: string;
  siteId?: string;
  type: string;
  organizationId: string;
}

export interface UpdateDomainRequest {
  id: string;
  name: string;
}

export interface CreateIntegrationWithAccountsRequest {
  integrationId: string;
  accounts: IntegrationAccount[];
}

// Response Types
export interface ApiResponse<T> {
  success: boolean;
  payload?: T;
  message?: string;
  error?: string;
}

export interface PlatformsResponse {
  platforms: Platform[];
}

export interface IntegrationsResponse {
  integrations: Integration[];
}

