import { authProvider } from './auth.provider';
import { tokenProvider } from './token.provider';

export const authMainProvider = [authProvider, tokenProvider];
