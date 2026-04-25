import api from "./index";
import type { Order } from "../types/order";
import { OrderStatusFilter, TimeFilterOption } from "../types/filters";

export interface OrderFilterParams {
  shopId: string;
  status?: OrderStatusFilter;
  timeFilter?: TimeFilterOption;
  startDate?: string;
  endDate?: string;
}

const orderApi = api.injectEndpoints({
  endpoints: (build) => ({
    getVendorOrders: build.query<Order[], OrderFilterParams>({
      query: ({ shopId, ...filters }) => {
        const cleanParams: Record<string, string> = {};

        // Validation for CUSTOM time filter
        if (filters.timeFilter === TimeFilterOption.CUSTOM && (!filters.startDate || !filters.endDate)) {
          console.warn("Skipping custom time filter: missing startDate or endDate");
          // Optionally, you can throw an error here depending on backend strictness
          // delete filters.timeFilter;
          filters.timeFilter = undefined;
        }

        // Dynamically append all valid, defined filters
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) {
            if (key === "timeFilter") {
              cleanParams.time = value; // Keep timeFilter naming consistent with user request, map for API
            } else {
              cleanParams[key] = value;
            }
          }
        });

        return {
          url: `/v2/order/${shopId}/orders`,
          method: "GET",
          params: cleanParams,
        };
      },
    }),
  }),
});

export const { useGetVendorOrdersQuery } = orderApi;
