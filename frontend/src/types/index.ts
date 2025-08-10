// TypeScript interfaces for RAF Event Booker entities

export interface User {
  id?: number;
  email: string;
  firstName: string;
  lastName: string;
  userType: 'admin' | 'event creator';
  status: 'active' | 'inactive';
  hashedPassword?: string; // Only used for creation/update
}

export interface Category {
  id?: number;
  name: string;
  description: string;
}

export interface Event {
  id?: number;
  title: string;
  description: string;
  createdAt?: string; // ISO date string
  eventDate: string; // ISO date string
  location: string;
  views?: number;
  likeCount?: number;
  dislikeCount?: number;
  authorId?: number;
  categoryId: number;
  maxCapacity?: number | null;
  // Related entities (populated by backend)
  author?: User;
  category?: Category;
  tags?: Tag[];
}

export interface Comment {
  id?: number;
  authorName: string;
  text: string;
  createdAt?: string; // ISO date string
  eventId: number;
  likeCount?: number;
  dislikeCount?: number;
}

export interface Tag {
  id?: number;
  name: string;
}

export interface RSVP {
  id?: number;
  userIdentifier: string; // email or name
  eventId: number;
  registrationDate?: string; // ISO date string
}

// API Response types
export interface LoginRequest {
  username: string; // Actually email, but backend expects 'username' field
  password: string;
}

export interface LoginResponse {
  jwt: string;
}

export interface PaginatedResponse<T> {
  data?: T[];
  events?: T[];
  comments?: T[];
  rsvps?: T[];
  page: number;
  limit: number;
  total?: number;
}

export interface ApiError {
  message: string;
}

export interface EventSearchResponse extends PaginatedResponse<Event> {
  searchTerm: string;
}

export interface CategoryEventsResponse extends PaginatedResponse<Event> {
  categoryId: number;
}

export interface TagEventsResponse extends PaginatedResponse<Event> {
  tagId: number;
}

export interface RSVPStatusResponse {
  eventId: number;
  currentCount: number;
  maxCapacity?: number;
  isFullyBooked: boolean;
  hasCapacityLimit: boolean;
}

export interface UserRSVPStatusResponse {
  eventId: number;
  userIdentifier: string;
  isRegistered: boolean;
}

export interface ApiResponse {
  message: string;
  action?: string; // for like/dislike responses
  user?: User;
  rsvp?: RSVP;
}

// JWT Payload type for authentication
export interface JWTPayload {
  sub: string; // email
  role: 'admin' | 'event creator';
  exp: number;
  iat: number;
}

// Form types for user input
export interface EventFormData {
  title: string;
  description: string;
  eventDate: string;
  location: string;
  categoryId: number | '';
  maxCapacity: number | '';
  tagNames: string; // comma-separated string
}

export interface CategoryFormData {
  name: string;
  description: string;
}

export interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  userType: 'admin' | 'event creator';
  password?: string;
  confirmPassword?: string;
}

export interface CommentFormData {
  authorName: string;
  text: string;
}

export interface RSVPFormData {
  userIdentifier: string;
}

// UI State types
export interface LoadingState {
  [key: string]: boolean;
}

export interface ErrorState {
  [key: string]: string | null;
}

// Session management types
export interface SessionData {
  viewedEvents: number[];
  likedEvents: number[];
  dislikedEvents: number[];
  likedComments: number[];
  dislikedComments: number[];
}