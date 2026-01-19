export interface UserCustomer {
  id: number;
  idCard: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  fullname?: string;
  password: string;
  totalRecords: number;
  passwordReset: boolean;
  estado: boolean;
}

export interface UserCustomerRole {
  userCustomerId: number;
  roleId: number;
  companyId: number;
}

export interface UserCustomerRoleRead {
  id: number;
  userCustomerId: number;
  companyId: number;
  roleId: number;
  userName: string;
  businessName: string;
  role: string;
  totalRecords: string;
  position: string;
}
