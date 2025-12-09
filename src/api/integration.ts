import apiClient from './client';
import { API_ENDPOINTS } from '../utils/constants';
import type { Integration, CreateIntegrationWithAccountsRequest, ApiResponse } from '../utils/types';

export const integrationApi = {
  getGoogleAuthURL: async (domainId: string, platformId: string): Promise<ApiResponse<{ url: string }>> => {
    const response = await apiClient.get<ApiResponse<{ url: string }>>(API_ENDPOINTS.GOOGLE_AUTH, {
      params: { domainId, platformId },
    });
    return response.data;
  },

  getFacebookAuthURL: async (domainId: string, platformId: string): Promise<ApiResponse<{ url: string }>> => {
    const response = await apiClient.get<ApiResponse<{ url: string }>>(API_ENDPOINTS.FACEBOOK_AUTH, {
      params: { domainId, platformId },
    });
    return response.data;
  },

  getTikTokAuthURL: async (domainId: string, platformId: string): Promise<ApiResponse<{ url: string }>> => {
    const response = await apiClient.get<ApiResponse<{ url: string }>>(API_ENDPOINTS.TIKTOK_AUTH, {
      params: { domainId, platformId },
    });
    return response.data;
  },

  getSnapchatAuthURL: async (domainId: string, platformId: string): Promise<ApiResponse<{ url: string }>> => {
    const response = await apiClient.get<ApiResponse<{ url: string }>>(API_ENDPOINTS.SNAPCHAT_AUTH, {
      params: { domainId, platformId },
    });
    return response.data;
  },

  getIntegrationById: async (id: string): Promise<ApiResponse<Integration>> => {
    const response = await apiClient.get<ApiResponse<Integration>>(API_ENDPOINTS.INTEGRATION_BY_ID(id));
    return response.data;
  },

  getIntegrationsByDomainId: async (id: string): Promise<ApiResponse<{ integrations: Integration[] }>> => {
    const response = await apiClient.get<ApiResponse<{ integrations: Integration[] }>>(
      API_ENDPOINTS.INTEGRATIONS_BY_DOMAIN_ID(id)
    );
    return response.data;
  },

  deleteIntegration: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(API_ENDPOINTS.DELETE_INTEGRATION, {
      data: id,
    });
    return response.data;
  },

  createIntegrationWithAccounts: async (
    data: CreateIntegrationWithAccountsRequest
  ): Promise<ApiResponse<Integration>> => {
    const response = await apiClient.post<ApiResponse<Integration>>(
      API_ENDPOINTS.CREATE_INTEGRATION_WITH_ACCOUNTS,
      data
    );
    return response.data;
  },
};

