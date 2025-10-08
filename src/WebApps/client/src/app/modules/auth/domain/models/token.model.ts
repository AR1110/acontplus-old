export interface TokenModel {
  token: string;
  decodedToken: {
    email?: string;
    name?: string;
    userId?: number;
    userRoleId?: number;
    exp?: number;
    [key: string]: any;
  };
}
