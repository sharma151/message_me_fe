export interface LoginFormInterface {
  email?: string
  password: string
}

export interface RegisterFormInterface {
  name?: string
  email?: string
  password?: string
}

export interface RegisterFormResponse {
  id: number
  name: string
  email: string
  createdAt: string
}

export interface AuthResponse {
  access_token: string
  user: {
    id: number
    name: string
    email: string
    createdAt: string
  }
}

export interface UserProfileResponse {
  id: number
  name: string
  email: string
  createdAt: string
}