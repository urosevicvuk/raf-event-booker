import axiosInstance from './api';
import type {Tag} from '../types';

export class TagService {
  static async getAllTags(): Promise<Tag[]> {
    const response = await axiosInstance.get<Tag[]>('/tags');
    return response.data;
  }

  static async getTagById(id: number): Promise<Tag> {
    const response = await axiosInstance.get<Tag>(`/tags/${id}`);
    return response.data;
  }

  static async createTag(name: string): Promise<Tag> {
    const response = await axiosInstance.post<Tag>('/tags', { name });
    return response.data;
  }

  static async createTagsFromString(tagsString: string): Promise<Tag[]> {
    const response = await axiosInstance.post<Tag[]>('/tags/bulk', { tags: tagsString });
    return response.data;
  }
}

