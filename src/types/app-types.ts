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
  tenant_id: number;
  customer_id: number;
  equipment_id: number;
  order_number: number;
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