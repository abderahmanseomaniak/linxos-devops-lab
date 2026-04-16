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