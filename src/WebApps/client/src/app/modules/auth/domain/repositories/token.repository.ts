import { TokenModel } from '../models/token.model';
import { UserData } from '../models/user-data.model';
import { SessionCache} from '@modules/auth/domain/models/session';

export abstract class TokenRepository {
  abstract saveSession(session: SessionCache): void;
  abstract getSession(): SessionCache | null;
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
