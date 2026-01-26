import type { AuthUser } from '@/types/auth';
import { getLocalStorage, removeLocalStorage, setLocalStorage } from './storage';

const TOKEN_KEY = 'access_token';
const USER_KEY = 'auth_user';

export const getToken = () => getLocalStorage<string>(TOKEN_KEY);
export const setToken = (token: string) => setLocalStorage(TOKEN_KEY, token);
export const removeToken = () => removeLocalStorage(TOKEN_KEY);

export const getUser = () => getLocalStorage<AuthUser>(USER_KEY);
export const setUser = (user: AuthUser) => setLocalStorage(USER_KEY, user);
export const removeUser = () => removeLocalStorage(USER_KEY);
