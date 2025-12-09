import apiClient from './client';
import { API_ENDPOINTS } from '../utils/constants';
import type { Organization, CreateOrganizationRequest, UpdateOrganizationRequest, ApiResponse } from '../utils/types';

export const organizationApi = {
  getOrganizations: async (): Promise<ApiResponse<Organization[]>> => {
    const response = await apiClient.get<ApiResponse<Organization[]>>(API_ENDPOINTS.ORGANIZATIONS);
    return response.data;
  },

  getOrganizationById: async (id: string): Promise<ApiResponse<Organization>> => {
    const response = await apiClient.get<ApiResponse<Organization>>(API_ENDPOINTS.ORGANIZATION_BY_ID(id));
    return response.data;
  },

  createOrganization: async (data: CreateOrganizationRequest): Promise<ApiResponse<Organization>> => {
    const response = await apiClient.post<ApiResponse<Organization>>(API_ENDPOINTS.CREATE_ORGANIZATION, data);
    return response.data;
  },

  updateOrganization: async (id: string, data: UpdateOrganizationRequest): Promise<ApiResponse<Organization>> => {
    const response = await apiClient.put<ApiResponse<Organization>>(API_ENDPOINTS.UPDATE_ORGANIZATION(id), data);
    return response.data;
  },
};

