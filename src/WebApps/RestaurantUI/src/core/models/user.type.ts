interface UserRoles {
  userId: number;
  roleId: number;
  companyId: number;
  role: string;
  companyUniqueId: string;
}
export interface User {
  username?: string;
  email?: string;
  roles: Array<UserRoles>;
}

export const UserEmptyState: User = {
  username: "",
  email: "",
  roles: [],
};
