import { UserData } from '@modules/auth/domain/models/user-data.model';

export interface Session {
  userData: UserData;
  menus: string[];
  permissions: string[];
  token: string;
  returnUrl?: string;
  company: {
    id: number
    businessName: string
    tradeName: string
    idCard: string
  }
}
