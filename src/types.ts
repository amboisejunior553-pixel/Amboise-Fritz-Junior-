export type Language = 'fr' | 'en' | 'ht';

export interface ServicePackage {
  id: string;
  name: string;
  priceUSD: number;
  priceHTG: number;
  features: string[];
}

export interface Service {
  id: string;
  title: string;
  description: string;
  packages: ServicePackage[];
}

export interface OrderOption {
  id: string;
  name: string;
  priceUSD: number;
  priceHTG: number;
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'client' | 'admin' | 'employee';
  status?: 'active' | 'busy' | 'offline';
}

export interface Order {
  id: number;
  user_id: number;
  assigned_to?: number;
  service_id: string;
  package_name: string;
  price_usd: number;
  price_htg: number;
  options: string; // JSON
  brief: string; // JSON
  status: 'pending' | 'production' | 'revision' | 'completed' | 'delivered';
  payment_status: 'pending' | 'paid' | 'failed';
  payment_method: string;
  payment_id?: string;
  payment_proof?: string;
  delivery_files?: string; // JSON
  feedback?: string; // JSON
  priority: 'normal' | 'urgent';
  created_at: string;
  updated_at: string;
  client_name?: string;
  employee_name?: string;
  user_email?: string;
  user_name?: string;
}

export interface Message {
  id: number;
  order_id: number;
  sender_id: number;
  sender_name: string;
  sender_role: string;
  content: string;
  type: 'text' | 'file';
  created_at: string;
}
