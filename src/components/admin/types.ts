export interface Booking {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  area: number;
  service_type: string;
  comment: string;
  status: 'new' | 'in-progress' | 'completed' | 'cancelled';
  created_at: string;
  booking_date?: string;
  booking_time?: string;
}

export const API_URL = 'https://functions.poehali.dev/efa2b104-cb77-4f2d-ac02-829e0e6ca609';