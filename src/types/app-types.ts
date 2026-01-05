export interface BreadcrumbItem {
  title: string;
  href: string;
}

export interface User {
  id: number;
  user_number: number;
  name: string;
  email: string;
  telephone: string;
  whatsapp: string;
  password: string;
  roles: number;
  status: number;
  users: [];
}

export interface Customer {
  data: [];
  id: number;
  customer_number: number;
  name: string;
  cpf: string;
  birth: string;
  email: string;
  zipcode: string;
  state: string;
  city: string;
  district: string;
  street: string;
  complement: string;
  number: number;
  phone: string;
  contactname: string;
  whatsapp: string;
  contactphone: string;
  observations: string;
}

export interface Order {
  id: number;
  order_number: number;
  tenant_id: number;
  customer_id: number;
  equipment_id: number;
  model: string;
  password: string;
  defect: string;
  state_conservation: string;
  accessories: string;
  budget_description: string;
  budget_value: number;
  service_status: number;
  delivery_forecast: string;
  observations: string;
  services_performed: string;
  parts: string;
  parts_value: number;
  service_value: number;
  service_cost: number;
  delivery_date: Date;
  responsible_technician: string;
  feedback: boolean;
}

export interface Budget {
  id: number;
  budget_number: number;
  category: string;
  service: string;
  model: string;
  description: string;
  estimated_time: string;
  warranty: string;
  obs: string;
  part_value: number;
  labor_value: number;
  total_value: number;
}

export interface Schedule {
  id: number;
  tenant_id: number;
  customer_id: number;
  user_id: number;
  schedules_number: number;
  schedules: Date;
  service: string;
  details: string;
  status: number;
  observations: number;
  created_at: Date;
}

export interface Message {
  id: number;
  tenant_id: number;
  sender_id: number;
  recipient_id: number;
  message_number: number;
  title: string;
  message: string;
  status: number;
  created_at: Date;
}

export interface Product {
  id: number;
  tenant_id: number;
  product_number: number;
  part_number: string;
  category: string;
  name: string;
  description: string;
  manufacturer: string;
  model_compatibility: string;
  cost_price: number;
  sale_price: number;
  quantity: number;
  minimum_stock_level: number;
  location: string;
  status: number;
  created_at: Date;
}

// Vendas *************************************
export interface SaleItemInput {
  productId: number
  quantity: number
  unitPrice: number
}

export interface CreateSaleDTO {
  customerId?: number | null
  tenantId: number
  items: SaleItemInput[]
}

export type ActionResponse = {
  success: boolean
  message?: string
  fieldErrors?: Record<string, string[]>
  data?: any // Retorno opcional da venda criada
}