// import api from "./index";
// import type { Order } from "../types/order";

// const orderApi = api.injectEndpoints({
//   endpoints: (build) => ({
//     getVendorOrders: build.query<Order[], string>({
//       query: (shopId) => ({
//         url: `/v1/orders/shop/${shopId}`,
//         method: "GET",
//       }),
//     }),
//   }),
// });

// export const { useGetVendorOrdersQuery } = orderApi;


import api from "./index";
import type { Order } from "../types/order";
import { mockOrderHistory } from "../data/mockOrderHistory";

const orderApi = api.injectEndpoints({
  endpoints: (build) => ({
    getVendorOrders: build.query<Order[], string>({
      
      queryFn: async () => {
        return { data: mockOrderHistory };
      },
    }),
  }),
});

export const { useGetVendorOrdersQuery } = orderApi;
