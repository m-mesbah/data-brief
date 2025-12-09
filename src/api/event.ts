import apiClient from './client';
import { API_ENDPOINTS } from '../utils/constants';
import type { ApiResponse } from '../utils/types';

export const eventApi = {
  getZidHistoricalOrders: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.post<ApiResponse<void>>(API_ENDPOINTS.ZID_HISTORICAL, { id });
    return response.data;
  },

  getSallaHistoricalOrders: async (domainId: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.get<ApiResponse<void>>(API_ENDPOINTS.SALLA_HISTORICAL, {
      params: { domainId },
    });
    return response.data;
  },

  getShopifyHistoricalOrders: async (data: unknown): Promise<ApiResponse<void>> => {
    const response = await apiClient.post<ApiResponse<void>>(API_ENDPOINTS.SHOPIFY_HISTORICAL, data);
    return response.data;
  },
};

