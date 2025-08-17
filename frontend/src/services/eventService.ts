import axiosInstance from './api';
import type {Event, PaginatedResponse, SearchResponse, EventFormData, InteractionResponse} from '../types';

export class EventService {
  // Basic CRUD operations
  static async getAllEvents(): Promise<Event[]> {
    const response = await axiosInstance.get<Event[]>('/events');
    return response.data;
  }

  static async getEventsPaginated(page: number = 1, limit: number = 10): Promise<PaginatedResponse<Event>> {
    const response = await axiosInstance.get<PaginatedResponse<Event>>('/events/paginated', {
      params: { page, limit }
    });
    return response.data;
  }

  static async getEventById(id: number): Promise<Event> {
    const response = await axiosInstance.get<Event>(`/events/${id}`);
    return response.data;
  }

  static async createEvent(event: EventFormData): Promise<Event> {
    const response = await axiosInstance.post<Event>('/events', event);
    return response.data;
  }

  static async updateEvent(id: number, event: EventFormData): Promise<Event> {
    const response = await axiosInstance.put<Event>(`/events/${id}`, event);
    return response.data;
  }

  static async deleteEvent(id: number): Promise<void> {
    await axiosInstance.delete(`/events/${id}`);
  }

  // Search and filtering
  static async searchEvents(
    searchTerm: string, 
    page: number = 1, 
    limit: number = 10
  ): Promise<SearchResponse<Event>> {
    const response = await axiosInstance.get<SearchResponse<Event>>('/events/search', {
      params: { q: searchTerm, page, limit }
    });
    return response.data;
  }

  static async getEventsByCategory(
    categoryId: number, 
    page: number = 1, 
    limit: number = 10
  ): Promise<PaginatedResponse<Event>> {
    const response = await axiosInstance.get<PaginatedResponse<Event>>(`/events/category/${categoryId}`, {
      params: { page, limit }
    });
    return response.data;
  }

  static async getEventsByTag(
    tagId: number, 
    page: number = 1, 
    limit: number = 10
  ): Promise<PaginatedResponse<Event>> {
    const response = await axiosInstance.get<PaginatedResponse<Event>>(`/events/tag/${tagId}`, {
      params: { page, limit }
    });
    return response.data;
  }

  static async getEventsByAuthor(authorId: number): Promise<Event[]> {
    const response = await axiosInstance.get<Event[]>(`/events/author/${authorId}`);
    return response.data;
  }

  // Public platform endpoints
  static async getLatestEvents(limit: number = 10): Promise<Event[]> {
    const response = await axiosInstance.get<Event[]>('/events/latest', {
      params: { limit }
    });
    return response.data;
  }

  static async getMostVisitedEvents(limit: number = 10): Promise<Event[]> {
    const response = await axiosInstance.get<Event[]>('/events/most-visited', {
      params: { limit }
    });
    return response.data;
  }

  static async getMostVisitedEventsLast30Days(limit: number = 10): Promise<Event[]> {
    const response = await axiosInstance.get<Event[]>('/events/most-visited-30days', {
      params: { limit }
    });
    return response.data;
  }

  static async getMostReactedEvents(limit: number = 3): Promise<Event[]> {
    const response = await axiosInstance.get<Event[]>('/events/most-reacted', {
      params: { limit }
    });
    return response.data;
  }

  static async getSimilarEvents(eventId: number, limit: number = 3): Promise<Event[]> {
    const response = await axiosInstance.get<Event[]>(`/events/${eventId}/similar`, {
      params: { limit }
    });
    return response.data;
  }

  static async getEventCount(): Promise<{ count: number }> {
    const response = await axiosInstance.get<{ count: number }>('/events/count');
    return response.data;
  }

  // Interactions
  static async incrementView(eventId: number): Promise<{ message: string }> {
    const response = await axiosInstance.post(`/events/${eventId}/view`);
    return response.data;
  }

  static async likeEvent(eventId: number): Promise<InteractionResponse> {
    const response = await axiosInstance.post<InteractionResponse>(`/events/${eventId}/like`);
    return response.data;
  }

  static async dislikeEvent(eventId: number): Promise<InteractionResponse> {
    const response = await axiosInstance.post<InteractionResponse>(`/events/${eventId}/dislike`);
    return response.data;
  }

  // RSVP
  static async getRSVPCount(eventId: number): Promise<{ eventId: number; currentRSVPCount: number }> {
    const response = await axiosInstance.get(`/events/${eventId}/rsvp-count`);
    return response.data;
  }
}

// Removed default export for consistency