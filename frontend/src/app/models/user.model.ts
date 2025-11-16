export interface User {
  _id: string;
  email: string;
  createdAt: Date;
}

export interface AuthResponse {
  _id: string;
  email: string;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
}
