//--------- Types pour l'authentification ----------//

export interface User {
  _id: string;
  email: string;
  username: string;
  avatar?: string;
}

export interface ZodFieldError {
  path: string[];
  message: string;
}

export interface ApiError {
  error: string;
  details?: ZodFieldError[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: ApiError | string | null;
}
