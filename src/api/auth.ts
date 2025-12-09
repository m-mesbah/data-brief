import apiClient from './client';
import { API_ENDPOINTS } from '../utils/constants';
import type { SignUpRequest, ApiResponse } from '../utils/types';

export const authApi = {
  sendMagicLink: async (email: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.post<ApiResponse<void>>(API_ENDPOINTS.SEND_MAGIC_LINK, { email });
    return response.data;
  },

  signUp: async (data: SignUpRequest): Promise<ApiResponse<void>> => {
    const response = await apiClient.post<ApiResponse<void>>(API_ENDPOINTS.SIGNUP, data);
    return response.data;
  },
};

