// User types
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  userType: 'event creator' | 'admin';
  status: 'active' | 'inactive';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  jwt: string;
}

// Category types
export interface Category {
  id: number;
  name: string;
  description: string;
}

// Tag types
export interface Tag {
  id: number;
  name: string;
}

// Event types
export interface Event {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  eventDate: string;
  location: string;
  views: number;
  likeCount: number;
  dislikeCount: number;
  authorId: number;
  categoryId: number;
  maxCapacity?: number;
  author?: User;
  category?: Category;
  tags?: Tag[];
  comments?: Comment[];
}

// Comment types
export interface Comment {
  id: number;
  authorName: string;
  text: string;
  createdAt: string;
  eventId: number;
  likeCount: number;
  dislikeCount: number;
}

// RSVP types
export interface RSVP {
  id: number;
  userIdentifier: string;
  eventId: number;
  registrationDate: string;
}

// API Response types
export interface PaginatedResponse<T> {
  items?: T[];
  events?: T[];
  users?: T[];
  categories?: T[];
  comments?: T[];
  page: number;
  limit: number;
  total?: number;
}

export interface SearchResponse<T> {
  items?: T[];
  events?: T[];
  searchTerm: string;
  page: number;
  limit: number;
}

export interface ApiError {
  message: string;
}

// Form types
export interface EventFormData {
  title: string;
  description: string;
  eventDate: string;
  location: string;
  categoryId: number;
  tags: string;
  maxCapacity?: number;
}

export interface CategoryFormData {
  name: string;
  description: string;
}

export interface UserFormData {
  email: string;
  firstName: string;
  lastName: string;
  userType: 'event creator' | 'admin';
  password: string;
  confirmPassword?: string;
}

export interface CommentFormData {
  authorName: string;
  text: string;
}

// Auth context types
export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isEventCreator: boolean;
  loading: boolean;
}

// Interaction types
export interface InteractionResponse {
  message: string;
  action: 'liked' | 'unliked' | 'disliked' | 'undisliked';
}