export type UserRole = "admin" | "moderator" | "user";

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  cin: string;
  role: UserRole;
  status: boolean;
  avatar?: string;
}