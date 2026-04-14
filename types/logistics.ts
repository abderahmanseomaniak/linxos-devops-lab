export type LogisticsStatus = 'Ready' | 'Shipped' | 'Delivered';

export interface Delivery {
  id: number;
  eventName: string;
  clubName: string;
  city: string;
  address: string;
  contactName: string;
  phone: string;
  date: string;
  quantity: number;
  status: LogisticsStatus;
}