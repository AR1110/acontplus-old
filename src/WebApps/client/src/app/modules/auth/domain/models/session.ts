import { UserData } from '@modules/auth/domain/models/user-data.model';
import {MenuItem} from "@core/models/menu.model";

export interface SessionCache {
  userData: UserData;
  permissions: string[];
  token: string;
  returnUrl?: string;
  company: {
    id: number
    businessName: string
    tradeName: string
    idCard: string
  },
  menuItems: MenuItem[];
  timestamp: number;
  version: string; // Para invalidar cache en actualizaciones
}
