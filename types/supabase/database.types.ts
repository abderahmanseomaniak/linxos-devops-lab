export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: Record<string, never>;
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
  Enums: {
    user_role: 'ADMIN' | 'SPONSORING_MANAGER' | 'LOGISTICS_MANAGER' | 'CONTENT_MANAGER';
    movement_type: 'IN' | 'OUT' | 'RESERVATION' | 'RETURN' | 'ADJUSTMENT';
    shipment_status: 'PREPARING' | 'IN_DELIVERY' | 'DELIVERED' | 'PROBLEM' | 'CANCELLED';
    recipient_type: 'APPLICANT' | 'INTERNAL';
    email_status: 'PENDING' | 'SENT' | 'FAILED';
    notification_type: string;
  };
}

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
export type Enums<T extends keyof Database['Enums']> =
  Database['Enums'][T];
