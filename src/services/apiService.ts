import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";

// --- API types  ---
interface LoginRequest {
  email: string;
  password: string;
}

interface AuthResponse {
  message: string;
  token: string;
}

interface CreatorProfile {
  id: number;
  username: string;
  display_name: string;
  widget_secret_token: string;
  email: string;
}

interface CreateDonationRequest {
  amount_cents: number;
  donor_name?: string;
  donor_message?: string;
}

interface DonationResponse {
  message: string;
  redirect_url: string;
  order_id: string;
}

interface Donation {
  id: number;
  creator_id: number;
  amount_cents: number;
  donor_name: string;
  donor_message: string;
  created_at: string;
}

interface DonationAlert {
  donor_name: string;
  amount_cents: number;
  donor_message: string;
}

const defaultBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,

  // This is the key for auth!
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const apiService = createApi({
  reducerPath: "api",
  baseQuery: defaultBaseQuery,
  tagTypes: ["Profile", "Donations"],
  endpoints: (builder) => ({
    // === AUTH ENDPOINTS ===
    register: builder.mutation<AuthResponse, any>({
      query: (credentials) => ({
        url: "auth/register",
        method: "POST",
        body: credentials,
      }),
    }),
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        body: credentials,
      }),
    }),

    // === PROTECTED ENDPOINTS ===
    getMyProfile: builder.query<CreatorProfile, void>({
      query: () => "me",
      providesTags: ["Profile"],

      async onCacheEntryAdded(
        _arg,
        { cacheDataLoaded, cacheEntryRemoved, dispatch }
      ) {
        // 1. Wait for the profile data
        const { data } = await cacheDataLoaded;
        const { widget_secret_token, id: creator_id } = data;

        // 2. Open WebSocket
        const ws = new WebSocket(
          `https://a56418e335cf.ngrok-free.app/ws/${widget_secret_token}`
        );
        ws.onmessage = (event) => {
          try {
            const newDonation: DonationAlert = JSON.parse(event.data);

            // Use 'dispatch' and 'apiSlice.util'
            dispatch(
              apiService.util.updateQueryData(
                "getDonations", // The endpoint to update
                undefined, // The args for that endpoint
                (draftDonations) => {
                  // An Immer updater function
                  draftDonations.unshift({
                    id: new Date().getTime(),
                    ...newDonation,
                    creator_id: creator_id,
                    created_at: new Date().toISOString(),
                  });
                }
              )
            );
          } catch (error) {
            console.error("Failed to parse WS message:", error);
          }
        };

        await cacheEntryRemoved;
        ws.close();
      },
    }),
    getDonations: builder.query<Donation[], void>({
      query: () => "/me/donations",
      providesTags: ["Donations"],
    }),

    // === PUBLIC ENDPOINTS ===
    createDonation: builder.mutation<
      DonationResponse,
      CreateDonationRequest & { username: string }
    >({
      query: ({ username, ...body }) => ({
        url: `donate/${username}`,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetMyProfileQuery,
  useGetDonationsQuery,
  useCreateDonationMutation,
} = apiService;
