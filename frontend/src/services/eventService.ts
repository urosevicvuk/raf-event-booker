import _axios from '../axiosInstance';
import type { 
    Event, 
    PaginatedResponse, 
    EventSearchResponse, 
    CategoryEventsResponse,
    TagEventsResponse,
    ApiResponse 
} from '../types';

export const eventService = {
    // Get all events
    getAllEvents: async (): Promise<Event[]> => {
        const response = await _axios.get('/events');
        return response.data;
    },

    // Create new event
    createEvent: async (eventData: Event): Promise<Event> => {
        const response = await _axios.post('/events', eventData);
        return response.data;
    },

    // Get event by ID
    getEventById: async (id: number): Promise<Event> => {
        const response = await _axios.get(`/events/${id}`);
        return response.data;
    },

    // Update event
    updateEvent: async (id: number, eventData: Event): Promise<Event> => {
        const response = await _axios.put(`/events/${id}`, eventData);
        return response.data;
    },

    // Delete event
    deleteEvent: async (id: number): Promise<ApiResponse> => {
        const response = await _axios.delete(`/events/${id}`);
        return response.data;
    },

    // Get paginated events
    getPaginatedEvents: async (page: number, limit: number): Promise<PaginatedResponse<Event>> => {
        const response = await _axios.get(`/events/paginated?page=${page}&limit=${limit}`);
        return response.data;
    },

    // Search events
    searchEvents: async (searchTerm: string, page: number, limit: number): Promise<EventSearchResponse> => {
        const response = await _axios.get(`/events/search?q=${searchTerm}&page=${page}&limit=${limit}`);
        return response.data;
    },

    // Get events by category
    getEventsByCategory: async (categoryId: number, page: number, limit: number): Promise<CategoryEventsResponse> => {
        const response = await _axios.get(`/events/category/${categoryId}?page=${page}&limit=${limit}`);
        return response.data;
    },

    // Get events by tag
    getEventsByTag: async (tagId: number, page: number, limit: number): Promise<TagEventsResponse> => {
        const response = await _axios.get(`/events/tag/${tagId}?page=${page}&limit=${limit}`);
        return response.data;
    },

    // Get events by author
    getEventsByAuthor: async (authorId: number): Promise<Event[]> => {
        const response = await _axios.get(`/events/author/${authorId}`);
        return response.data;
    },

    // Get latest events
    getLatestEvents: async (limit?: number): Promise<Event[]> => {
        const url = limit ? `/events/latest?limit=${limit}` : '/events/latest';
        const response = await _axios.get(url);
        return response.data;
    },

    // Get most visited events
    getMostVisitedEvents: async (limit?: number): Promise<Event[]> => {
        const url = limit ? `/events/most-visited?limit=${limit}` : '/events/most-visited';
        const response = await _axios.get(url);
        return response.data;
    },

    // Get most visited events in last 30 days
    getMostVisited30Days: async (limit?: number): Promise<Event[]> => {
        const url = limit ? `/events/most-visited-30days?limit=${limit}` : '/events/most-visited-30days';
        const response = await _axios.get(url);
        return response.data;
    },

    // Get most reacted events
    getMostReactedEvents: async (limit?: number): Promise<Event[]> => {
        const url = limit ? `/events/most-reacted?limit=${limit}` : '/events/most-reacted';
        const response = await _axios.get(url);
        return response.data;
    },

    // Get similar events
    getSimilarEvents: async (eventId: number, limit?: number): Promise<Event[]> => {
        const url = limit ? `/events/${eventId}/similar?limit=${limit}` : `/events/${eventId}/similar`;
        const response = await _axios.get(url);
        return response.data;
    },

    // Increment view count
    incrementView: async (eventId: number): Promise<ApiResponse> => {
        const response = await _axios.post(`/events/${eventId}/view`);
        return response.data;
    },

    // Like event
    likeEvent: async (eventId: number): Promise<ApiResponse> => {
        const response = await _axios.post(`/events/${eventId}/like`);
        return response.data;
    },

    // Dislike event
    dislikeEvent: async (eventId: number): Promise<ApiResponse> => {
        const response = await _axios.post(`/events/${eventId}/dislike`);
        return response.data;
    },

    // Get RSVP count
    getRSVPCount: async (eventId: number): Promise<{ eventId: number; currentRSVPCount: number }> => {
        const response = await _axios.get(`/events/${eventId}/rsvp-count`);
        return response.data;
    },
};