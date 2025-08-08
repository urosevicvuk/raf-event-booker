export interface User {
  id?: number;
  email: string;
  firstName: string;
  lastName: string;
  userType: 'event creator' | 'admin';
  status: 'active' | 'inactive';
  hashedPassword?: string;
}

export interface Category {
  id?: number;
  name: string;
  description: string;
}

export interface Tag {
  id?: number;
  name: string;
}

export interface Event {
  id?: number;
  title: string;
  description: string;
  createdAt?: string;
  eventDate: string;
  location: string;
  views?: number;
  likeCount?: number;
  dislikeCount?: number;
  authorId: number;
  categoryId: number;
  maxCapacity?: number;
  author?: User;
  category?: Category;
  tags?: Tag[];
  comments?: Comment[];
}

export interface Comment {
  id?: number;
  authorName: string;
  text: string;
  createdAt?: string;
  eventId: number;
  likeCount?: number;
  dislikeCount?: number;
}

export interface RSVP {
  id?: number;
  userIdentifier: string;
  eventId: number;
  registrationDate?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}