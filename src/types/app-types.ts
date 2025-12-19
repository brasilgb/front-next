export interface User {
  id: number;
  user_number: number;
  name: string;
  email: string;
  telephone: string;
  whatsapp: string;
  password: string;
  roles:number;
  status: number;
}

export interface Customer {
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

export interface BreadcrumbItem {
  title: string;
  href: string;
}