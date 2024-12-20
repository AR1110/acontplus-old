import { TokenModel } from "../models/token.model";
import { UserData } from "../models/user-data.model";


export abstract class TokenRepository {
  abstract getToken(): string | null;
  abstract setToken(token: string): void;
  abstract removeToken(): void;
  abstract parseJwt(): TokenModel['decodedToken'] | null;
  abstract getDecodedToken(): TokenModel['decodedToken'] | null;
  abstract getUserRoleId(): number;
  abstract isTokenExpired(): boolean;
  abstract setUserData<T>(obj:T): void;
  abstract getUserData(): UserData | null;

  abstract setDataEstab<T>(data: T): void;
  abstract getDataEstab(): any
  abstract removeAllStorage():void
}
