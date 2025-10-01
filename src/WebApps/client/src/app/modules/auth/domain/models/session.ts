import {UserData} from "@modules/auth/domain/models/user-data.model";

export interface Session {
  userData: UserData;
  menus: string[];
  permissions: string[];
  token: string;
  returnUrl?: string;
}
