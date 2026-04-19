import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchBaseQuery } from "@reduxjs/toolkit/query";

const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://b8d8-2401-4900-51e9-9ca6-95fa-5c37-2aea-d3ca.ngrok-free.app/quickVerse", // change base url for all api endpoints of vendor
    prepareHeaders: (headers) => {
      headers.set(
        "Authorization",
        "Basic cXZDYXN0bGVFbnRyeTpjYSR0bGVfUGVybWl0QDAx", // change with vendor token
      );
      headers.set("Content-Type", "application/json");
      headers.set("Accept", "application/json");
      headers.set("Request-Origin", "VENDOR"); // vendor request origin

      return headers;
    },
  }),
  endpoints: (_) => ({}),
});

export default api;
