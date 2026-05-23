export type UserRole = "ADMIN" | "SPONSORSHIP_MANAGER" | "LOGISTICS_MANAGER" | "UGC_MANAGER";

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  cin: string | null;
  role: UserRole;
  status: boolean;
  avatar: string | null;
  created_at: string;
  updated_at: string;
}

export interface UsersTableProps {
  data: User[];
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
  onAdd?: () => void;
}

export type UserItem = User & {
  statusDisplay: "Active" | "Inactive" | "Pending"
  performance: number
}