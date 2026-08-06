import { baseApi } from "../../api/baseApi";

const restaurantApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRestaurants: builder.query({
      query: (params?: { page?: number; limit?: number }) => ({
        url: "/restaurant/get-all",
        params,
      }),
      transformResponse: (response: any) => response.data, // { meta, data: [...] }
      providesTags: ["restaurants"],
    }),
    getRestaurantById: builder.query({
      query: (id: string) => ({
        url: `/restaurant/single/${id}`,
      }),
      transformResponse: (response: any) => response.data,
      providesTags: (result, error, id) => [{ type: "restaurants", id }],
    }),
  }),
});

export const { useGetRestaurantsQuery, useGetRestaurantByIdQuery } =
  restaurantApi;
