import _axios from '../axiosInstance';
import type { Comment, PaginatedResponse, ApiResponse } from '../types';

export const commentService = {
    // Create new comment
    createComment: async (commentData: Comment): Promise<Comment> => {
        const response = await _axios.post('/comments', commentData);
        return response.data;
    },

    // Get comments for event
    getCommentsByEvent: async (eventId: number): Promise<Comment[]> => {
        const response = await _axios.get(`/comments/event/${eventId}`);
        return response.data;
    },

    // Get paginated comments for event
    getPaginatedCommentsByEvent: async (eventId: number, page: number, limit: number): Promise<PaginatedResponse<Comment> & { eventId: number }> => {
        const response = await _axios.get(`/comments/event/${eventId}/paginated?page=${page}&limit=${limit}`);
        return response.data;
    },

    // Like comment
    likeComment: async (commentId: number): Promise<ApiResponse> => {
        const response = await _axios.post(`/comments/${commentId}/like`);
        return response.data;
    },

    // Dislike comment
    dislikeComment: async (commentId: number): Promise<ApiResponse> => {
        const response = await _axios.post(`/comments/${commentId}/dislike`);
        return response.data;
    },
};