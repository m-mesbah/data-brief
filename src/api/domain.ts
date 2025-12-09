import apiClient from './client';
import { API_ENDPOINTS } from '../utils/constants';
import type { Domain, CreateDomainRequest, UpdateDomainRequest, ApiKey, ApiResponse } from '../utils/types';

export const domainApi = {
  getDomains: async (): Promise<ApiResponse<Domain[]>> => {
    const response = await apiClient.get<ApiResponse<Domain[]>>(API_ENDPOINTS.DOMAINS);
    return response.data;
  },

  getDomainById: async (id: string): Promise<ApiResponse<Domain>> => {
    const response = await apiClient.get<ApiResponse<Domain>>(API_ENDPOINTS.DOMAIN_BY_ID(id));
    return response.data;
  },

  createDomain: async (data: CreateDomainRequest): Promise<ApiResponse<Domain>> => {
    const response = await apiClient.post<ApiResponse<Domain>>(API_ENDPOINTS.CREATE_DOMAIN, data);
    return response.data;
  },

  updateDomain: async (data: UpdateDomainRequest): Promise<ApiResponse<Domain>> => {
    const response = await apiClient.put<ApiResponse<Domain>>(API_ENDPOINTS.UPDATE_DOMAIN, data);
    return response.data;
  },

  deleteDomain: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(API_ENDPOINTS.DELETE_DOMAIN, {
      data: { id },
    });
    return response.data;
  },

  getApiKeys: async (): Promise<ApiResponse<ApiKey[]>> => {
    const response = await apiClient.get<ApiResponse<ApiKey[]>>(API_ENDPOINTS.API_KEYS);
    return response.data;
  },

  getApiKeyByDomainId: async (id: string): Promise<ApiResponse<ApiKey>> => {
    const response = await apiClient.get<ApiResponse<ApiKey>>(API_ENDPOINTS.API_KEY_BY_DOMAIN_ID(id));
    return response.data;
  },
};

