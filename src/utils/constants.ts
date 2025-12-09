// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  SEND_MAGIC_LINK: '/api/user/send-magic-link',
  SIGNUP: '/api/user/signup',
  
  // Organizations
  ORGANIZATIONS: '/api/organization/user',
  ORGANIZATION_BY_ID: (id: string) => `/api/organization/user/get/${id}`,
  CREATE_ORGANIZATION: '/api/organization/user/create',
  UPDATE_ORGANIZATION: (id: string) => `/api/organization/user/update/${id}`,
  
  // Domains
  DOMAINS: '/api/domains',
  DOMAIN_BY_ID: (id: string) => `/api/domain/${id}`,
  CREATE_DOMAIN: '/api/domain/create',
  UPDATE_DOMAIN: '/api/domain/update',
  DELETE_DOMAIN: '/api/domain/delete',
  API_KEYS: '/api/api_keys',
  API_KEY_BY_DOMAIN_ID: (id: string) => `/api/api_key_by_id/${id}`,
  
  // Platforms
  PLATFORMS: '/api/platform',
  PLATFORM_BY_ID: (id: string) => `/api/platform/${id}`,
  
  // Integrations
  GOOGLE_AUTH: '/api/google/auth',
  FACEBOOK_AUTH: '/api/facebook/auth',
  TIKTOK_AUTH: '/api/tiktok/auth',
  SNAPCHAT_AUTH: '/api/snapchat/auth',
  INTEGRATION_BY_ID: (id: string) => `/api/integration/${id}`,
  INTEGRATIONS_BY_DOMAIN_ID: (id: string) => `/api/integrations/${id}`,
  DELETE_INTEGRATION: '/api/integration',
  CREATE_INTEGRATION_WITH_ACCOUNTS: '/api/integrate/accounts',
  
  // Events
  ZID_HISTORICAL: '/api/event/zid/historical',
  SALLA_HISTORICAL: '/api/event/salla',
  SHOPIFY_HISTORICAL: '/api/historical/shopify/orders',
} as const;

// Routes
export const ROUTES = {
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  ORGANIZATIONS: '/organizations',
  ORGANIZATION_DETAIL: (id: string) => `/organizations/${id}`,
  ORGANIZATION_CREATE: '/organizations/create',
  DOMAINS: '/domains',
  DOMAIN_DETAIL: (id: string) => `/domains/${id}`,
  DOMAIN_CREATE: '/domains/create',
  PLATFORMS: '/platforms',
  PLATFORM_DETAIL: (id: string) => `/platforms/${id}`,
  INTEGRATIONS: '/integrations',
  INTEGRATION_DETAIL: (id: string) => `/integrations/${id}`,
  INTEGRATION_CREATE: '/integrations/create',
  EVENTS: '/events',
} as const;

// App Constants
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'DataPulse';
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
export const FIREBASE_API_KEY = import.meta.env.VITE_FIREBASE_API_KEY || '';

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER: 'user',
} as const;

