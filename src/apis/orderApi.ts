import api from "./index";
import type { PaginatedOrderResponse } from "../types/order";
import { OrderStatusFilter, TimeFilterOption } from "../types/filters";

export interface DashboardSummary {
  totalOrders: number;
  totalRevenue: number;
  acceptedOrders: number;
  rejectedOrders: number;
}

export interface OrderFilterParams {
  shopId: string;
  orderStatus?: OrderStatusFilter[];
  timeRange?: TimeFilterOption;
  fromTime?: string;
  toTime?: string;
  page?: number;
  size?: number;
}

const orderApi = api.injectEndpoints({
  endpoints: (build) => ({
    getDashboardSummary: build.query<DashboardSummary, string>({
      query: (shopId) => ({
        url: `/v3/vendor/dashboard/summary`,
        method: "GET",
        params: { shopId },
      }),
    }),
    getVendorOrders: build.query<PaginatedOrderResponse, OrderFilterParams>({
      query: ({ shopId, ...filters }) => {
        const cleanParams = new URLSearchParams();

        if (filters.orderStatus && filters.orderStatus.length > 0) {
          filters.orderStatus.forEach(status => cleanParams.append("orderStatus", status));
        }
        if (filters.timeRange) cleanParams.append("timeRange", filters.timeRange);
        if (filters.timeRange === TimeFilterOption.CUSTOM) {
          if (filters.fromTime) cleanParams.append("fromTime", filters.fromTime);
          if (filters.toTime) cleanParams.append("toTime", filters.toTime);
        }
        cleanParams.append("page", String(filters.page ?? 0));
        cleanParams.append("size", String(filters.size ?? 15));

        return {
          url: `/v2/order/${shopId}/orders`,
          method: "GET",
          params: cleanParams,
        };
      },
      transformResponse: (raw: { response: PaginatedOrderResponse }) => raw.response,
    }),
  }),
});

export const { useGetVendorOrdersQuery, useGetDashboardSummaryQuery } = orderApi;
