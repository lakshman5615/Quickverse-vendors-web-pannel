import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchBaseQuery } from "@reduxjs/toolkit/query";
export const baseurl = import.meta.env.VITE_API_URL;
const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseurl}quickVerse`,
    prepareHeaders: (headers) => {
      headers.set("Authorization", `Basic ${import.meta.env.VITE_API_BASIC_TOKEN}`);
      headers.set("Content-Type", "application/json");
      headers.set("Accept", "application/json");
      headers.set("Request-Origin", "VENDOR");

      return headers;
    },
  }),
  endpoints: (_) => ({}),
});

export default api;
