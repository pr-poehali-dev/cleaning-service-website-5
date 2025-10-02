export interface Booking {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  area: number;
  service_type: string;
  comment: string;
  status: 'new' | 'assigned' | 'in-progress' | 'completed' | 'cancelled';
  created_at: string;
  booking_date?: string;
  booking_time?: string;
  assignee_id?: number | null;
  assignee_name?: string | null;
}

export interface User {
  id: number;
  full_name: string;
  phone: string;
  login?: string;
  role: 'super_admin' | 'admin' | 'manager' | 'operator';
  created_at?: string;
  updated_at?: string;
}

export const API_URL = 'https://functions.poehali.dev/efa2b104-cb77-4f2d-ac02-829e0e6ca609';
export const USERS_API_URL = 'https://functions.poehali.dev/51beba0b-3e24-426c-a0a2-94a9a8097920';