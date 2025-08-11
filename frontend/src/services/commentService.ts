import axiosInstance from './api';
import type {Comment, CommentFormData, PaginatedResponse, InteractionResponse} from '../types';

export class CommentService {
  static async getCommentsForEvent(
    eventId: number, 
    page: number = 1, 
    limit: number = 10
  ): Promise<PaginatedResponse<Comment>> {
    const response = await axiosInstance.get<PaginatedResponse<Comment>>(`/comments/event/${eventId}`, {
      params: { page, limit }
    });
    return response.data;
  }

  static async createComment(eventId: number, comment: CommentFormData): Promise<Comment> {
    const response = await axiosInstance.post<Comment>('/comments', {
      ...comment,
      eventId
    });
    return response.data;
  }

  static async likeComment(commentId: number): Promise<InteractionResponse> {
    const response = await axiosInstance.post<InteractionResponse>(`/comments/${commentId}/like`);
    return response.data;
  }

  static async dislikeComment(commentId: number): Promise<InteractionResponse> {
    const response = await axiosInstance.post<InteractionResponse>(`/comments/${commentId}/dislike`);
    return response.data;
  }
}

export default CommentService;