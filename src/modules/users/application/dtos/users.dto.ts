export interface UsersDTO {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  roles: string[];
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: Date;
  updatedAt: Date;
}
