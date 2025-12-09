import apiClient from './client';
import { API_ENDPOINTS } from '../utils/constants';
import type { Platform, PlatformsResponse, ApiResponse } from '../utils/types';

export const platformApi = {
  getPlatforms: async (): Promise<ApiResponse<PlatformsResponse>> => {
    const response = await apiClient.get<ApiResponse<PlatformsResponse>>(API_ENDPOINTS.PLATFORMS);
    return response.data;
  },

  getPlatformById: async (id: string): Promise<ApiResponse<Platform>> => {
    const response = await apiClient.get<ApiResponse<Platform>>(API_ENDPOINTS.PLATFORM_BY_ID(id));
    return response.data;
  },
};

