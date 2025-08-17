import axiosInstance from './api';
import type {RSVP} from '../types';

export class RSVPService {
  static async registerForEvent(eventId: number, userIdentifier: string): Promise<{ message: string }> {
    // Generate current timestamp in the format backend expects: "YYYY-MM-DD HH:mm:ss"
    const now = new Date();
    const registrationDate = now.toISOString().slice(0, 19).replace('T', ' ');
    
    const response = await axiosInstance.post(`/rsvp`, {
      eventId,
      userIdentifier,
      registrationDate // CRITICAL FIX: Include required field
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

