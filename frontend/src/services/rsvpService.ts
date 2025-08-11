import axiosInstance from './api';
import type {RSVP} from '../types';

export class RSVPService {
  static async registerForEvent(eventId: number, userIdentifier: string): Promise<{ message: string }> {
    const response = await axiosInstance.post(`/rsvp`, {
      eventId,
      userIdentifier
    });
    return response.data;
  }

  static async checkUserRegistration(eventId: number, userIdentifier: string): Promise<{ registered: boolean }> {
    const response = await axiosInstance.get(`/rsvp/check`, {
      params: { eventId, userIdentifier }
    });
    return response.data;
  }

  static async getEventRegistrations(eventId: number): Promise<RSVP[]> {
    const response = await axiosInstance.get<RSVP[]>(`/rsvp/event/${eventId}`);
    return response.data;
  }

  static async getRegistrationStatus(eventId: number): Promise<{
    canRegister: boolean;
    currentCount: number;
    maxCapacity?: number;
    isFull: boolean;
  }> {
    const response = await axiosInstance.get(`/rsvp/status/${eventId}`);
    return response.data;
  }
}

export default RSVPService;