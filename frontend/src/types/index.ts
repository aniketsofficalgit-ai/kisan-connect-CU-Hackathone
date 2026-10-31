export type UserRole = 'farmer' | 'worker' | 'machinery_owner' | 'buyer' | 'admin';
export type VerificationStatus = 'not_verified' | 'pending' | 'verified';
export type Language = 'en' | 'hi' | 'pa';

export interface User {
  id: number;
  full_name: string;
  mobile_number: string;
  email?: string;
  role: UserRole;
  village?: string;
  town?: string;
  district: string;
  state: string;
  preferred_language: Language;
  verification_status: VerificationStatus;
  verification_notes?: string;
  profile_image_url?: string;
  bio?: string;
  is_active: boolean;
  created_at: string;
}

export interface WorkerProfile {
  id: number;
  user_id: number;
  skills: string;
  experience_years: number;
  expected_wage: number;
  wage_unit: string;
  is_group: boolean;
  group_size: number;
  preferred_work_area?: string;
  is_available: boolean;
  rating_average: number;
  review_count: number;
  completed_jobs_count: number;
  created_at: string;
  user?: User;
}

export interface MachineryListing {
  id: number;
  owner_id: number;
  title: string;
  category: string;
  make_model?: string;
  horse_power?: string;
  rental_price: number;
  pricing_unit: string;
  location_village?: string;
  location_district: string;
  location_state: string;
  description?: string;
  specifications?: string;
  image_url?: string;
  is_available: boolean;
  includes_operator: boolean;
  includes_fuel: boolean;
  maintenance_status: string;
  created_at: string;
  updated_at: string;
  owner?: User;
}

export interface CropListing {
  id: number;
  farmer_id: number;
  crop_name: string;
  category: string;
  variety?: string;
  available_quantity: number;
  quantity_unit: string;
  asking_price: number;
  price_unit: string;
  harvest_date?: string;
  quality_grade: string;
  village?: string;
  district: string;
  state: string;
  description?: string;
  image_url?: string;
  preferred_contact_method: string;
  status: string;
  created_at: string;
  updated_at: string;
  farmer?: User;
}

export interface WorkerRequest {
  id: number;
  farmer_id: number;
  worker_id: number;
  work_type: string;
  start_date: string;
  end_date?: string;
  duration_days: number;
  workers_count: number;
  location: string;
  proposed_wage: number;
  wage_unit: string;
  total_estimated_amount: number;
  notes?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'completed';
  response_note?: string;
  created_at: string;
  updated_at: string;
  farmer?: User;
  worker?: User;
}

export interface MachineryBooking {
  id: number;
  farmer_id: number;
  machinery_id: number;
  start_date: string;
  end_date: string;
  rental_units: number;
  unit_type: string;
  estimated_amount: number;
  delivery_needed: boolean;
  delivery_address?: string;
  notes?: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'completed';
  owner_response_note?: string;
  created_at: string;
  updated_at: string;
  farmer?: User;
  machinery?: MachineryListing;
}

export interface BuyerInquiry {
  id: number;
  buyer_id: number;
  crop_id: number;
  requested_quantity: number;
  quantity_unit: string;
  proposed_price: number;
  price_unit: string;
  total_proposed_amount: number;
  message?: string;
  delivery_preference: string;
  status: 'pending' | 'accepted' | 'rejected' | 'counter_offered' | 'completed';
  farmer_response_note?: string;
  created_at: string;
  updated_at: string;
  buyer?: User;
  crop?: CropListing;
}

export interface Message {
  id: number;
  conversation_id: number;
  sender_id: number;
  content: string;
  is_read: boolean;
  created_at: string;
  sender?: User;
}

export interface Conversation {
  id: number;
  participant1_id: number;
  participant2_id: number;
  subject?: string;
  context_type?: string;
  context_id?: number;
  last_message_at: string;
  created_at: string;
  participant1?: User;
  participant2?: User;
  unread_count: number;
  last_message?: Message;
}

export interface NotificationItem {
  id: number;
  user_id: number;
  title: string;
  message: string;
  notification_type: string;
  reference_id?: number;
  reference_type?: string;
  is_read: boolean;
  created_at: string;
}

export interface WeatherForecastDay {
  date: string;
  day_name: string;
  temp_max: number;
  temp_min: number;
  precipitation_prob: number;
  weather_condition: string;
  icon: string;
}

export interface WeatherData {
  location: string;
  district: string;
  state: string;
  latitude: number;
  longitude: number;
  current_temperature: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  rain_probability: number;
  weather_condition: string;
  icon: string;
  agricultural_advisory: string;
  spraying_suitability: string;
  irrigation_advice: string;
  forecast: WeatherForecastDay[];
  last_updated: string;
  source: string;
}

export interface DemoAccount {
  role: UserRole;
  title: string;
  identifier: string;
  email: string;
  password: string;
  description: string;
}
