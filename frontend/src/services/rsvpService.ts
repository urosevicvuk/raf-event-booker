import _axios from '../axiosInstance';
import type { RSVP, RSVPStatusResponse, UserRSVPStatusResponse, PaginatedResponse, ApiResponse } from '../types';

export const rsvpService = {
    // Register for event (RSVP)
    registerForEvent: async (rsvpData: RSVP): Promise<ApiResponse & { rsvp: RSVP }> => {
        const response = await _axios.post('/rsvp', rsvpData);
        return response.data;
    },

    // Get RSVP status and capacity info for event
    getRSVPStatus: async (eventId: number): Promise<RSVPStatusResponse> => {
        const response = await _axios.get(`/rsvp/event/${eventId}/status`);
        return response.data;
    },

    // Check if user is registered for event
    getUserRSVPStatus: async (eventId: number, userIdentifier: string): Promise<UserRSVPStatusResponse> => {
        const response = await _axios.get(`/rsvp/event/${eventId}/user/${userIdentifier}/status`);
        return response.data;
    },

    // Get all RSVPs for event (paginated)
    getEventRSVPs: async (eventId: number, page: number, limit: number): Promise<PaginatedResponse<RSVP> & { eventId: number }> => {
        const response = await _axios.get(`/rsvp/event/${eventId}?page=${page}&limit=${limit}`);
        return response.data;
    },
};