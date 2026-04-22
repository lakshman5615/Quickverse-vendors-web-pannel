import api from "./index"; 
import { mockAllOrders } from "../data/mockStats"; 
import type { Order } from "../types/order";

export const orderApi = api.injectEndpoints({
  endpoints: (builder) => ({
    
    getAllOrders: builder.query<Order[], string>({
      // ✅ Use queryFn to skip the network call and return Mock Data directly
      async queryFn() {
        return { data: mockAllOrders };
      },

      /* ⚠️ FUTURE INTEGRATION: 
         When your backend is ready, delete 'queryFn' above 
         and uncomment these lines: 
      query: (shopId) => `/orders/all?shopId=${shopId}`,
      transformResponse: (response: Order[]) => response,
      */
    }),
  }),
  overrideExisting: false,
});

export const { useGetAllOrdersQuery } = orderApi;
