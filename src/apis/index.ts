import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchBaseQuery } from "@reduxjs/toolkit/query";

const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://bde9-2409-4081-8786-c108-8db4-cd35-de04-c31.ngrok-free.app/quickVerse", // change base url for all api endpoints of vendor
    prepareHeaders: (headers) => {
      headers.set(
        "Authorization",
        "Basic cXZDYXN0bGVFbnRyeTpjYSR0bGVfUGVybWl0QDAx",
      );
      headers.set("Content-Type", "application/json");
      headers.set("Accept", "application/json");
      headers.set("Request-Origin", "VENDOR");

      return headers;
    },
  }),
  endpoints: (_) => ({}),
});

export default api;
