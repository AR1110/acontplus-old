import { TokenModel } from '../models/token.model';
import { UserData } from '../models/user-data.model';
import { Session } from '@modules/auth/domain/models/session';

export abstract class TokenRepository {
  abstract saveSession(session: Session): void;
  abstract getSession(): Session | null;
  abstract clear(): void;
  abstract getToken(): string | null;
  abstract setToken(token: string): void;
  abstract removeToken(): void;
  abstract parseJwt(): TokenModel['decodedToken'] | null;
  abstract getDecodedToken(): TokenModel['decodedToken'] | null;
  abstract getUserRoleId(): number;
  abstract isTokenExpired(): boolean;
  abstract getUserData(): UserData | null;
}
