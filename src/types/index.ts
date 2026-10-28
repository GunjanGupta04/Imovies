export type UserRole = 'customer' | 'theatre_manager' | 'super_admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
}

export type SeatTier = 'standard' | 'premium' | 'vip';
export type SeatStatus = 'available' | 'selected' | 'reserved' | 'locked';

export interface Seat {
  id: string; // e.g. "A-1"
  row: string;
  col: number;
  tier: SeatTier;
  price: number;
  status: SeatStatus;
}

export interface SnackItem {
  id: string;
  name: string;
  category: 'popcorn' | 'beverage' | 'combo';
  price: number;
  description: string;
  icon: string;
}

export interface Movie {
  id: string;
  title: string;
  tagline: string;
  synopsis: string;
  duration: number; // in minutes
  rating: number; // 0 - 5 or 0 - 10
  certification: 'PG' | 'PG-13' | 'R' | 'U/A';
  genres: string[];
  releaseDate: string;
  director: string;
  cast: string[];
  languages: string[];
  formats: ('IMAX 3D' | 'Dolby Atmos' | '4DX' | 'Standard 2D')[];
  posterUrl: string;
  backdropUrl?: string;
  bannerTag?: string;
}

export interface Showtime {
  id: string;
  movieId: string;
  theatreId: string;
  theatreName: string;
  screenName: string;
  screenType: 'IMAX Laser' | 'Dolby Cinema' | 'ScreenX' | 'Standard 4K';
  date: string;
  time: string;
  basePrice: number;
  availableSeatsCount: number;
  totalSeatsCount: number;
}

export interface Booking {
  id: string;
  bookingReference: string;
  movieId: string;
  movieTitle: string;
  moviePoster: string;
  theatreName: string;
  screenName: string;
  screenType: string;
  showtime: string;
  showdate: string;
  seats: {
    id: string;
    row: string;
    col: number;
    tier: SeatTier;
    price: number;
  }[];
  snacks: {
    id: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  subtotal: number;
  bookingFee: number;
  tax: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: 'paid' | 'refunded' | 'pending';
  bookingStatus: 'confirmed' | 'cancelled';
  qrCodeToken: string;
  createdAt: string;
  userEmail: string;
}

export type ActiveTab = 
  | 'movies'
  | 'architecture'
  | 'er_diagram'
  | 'mvc_pattern'
  | 'user_flow'
  | 'roles'
  | 'features'
  | 'demo_video'
  | 'setup_deployment';
