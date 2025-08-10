import _axios from '../axiosInstance';
import type { Tag } from '../types';

export const tagService = {
    // Get all tags
    getAllTags: async (): Promise<Tag[]> => {
        const response = await _axios.get('/tags');
        return response.data;
    },

    // Create new tag
    createTag: async (tagData: Tag): Promise<Tag> => {
        const response = await _axios.post('/tags', tagData);
        return response.data;
    },

    // Get tags for event
    getTagsByEvent: async (eventId: number): Promise<Tag[]> => {
        const response = await _axios.get(`/tags/event/${eventId}`);
        return response.data;
    },
};