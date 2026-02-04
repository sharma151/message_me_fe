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
export interface Avatar {
  url: string
  localPath: string
  _id: string
}

export interface User {
  _id: string
  avatar: Avatar
  username: string
  email: string
  role: string
  loginType: string
  isEmailVerified: boolean
  createdAt: string
  updatedAt: string
  __v: number
}

export interface AuthResponse {
  accessToken: string
  user: User
  statusCode: number
  data: {
    user: User
    accessToken: string
    refreshToken: string
  }
  message: string
  success: boolean
}
export interface ProfileAccount {
  _id: string
  avatar: Avatar
  username: string
  email: string
  isEmailVerified: boolean
}

export interface UserProfile {
  _id: string
  coverImage: Avatar
  dob: string
  location: string
  countryCode: string
  owner: string
  createdAt: string
  updatedAt: string
  __v: number
  followersCount: number
  followingCount: number
  isFollowing: boolean
}

export interface UserProfileResponse {
  account: ProfileAccount
  statusCode: number
  data: UserProfile
  phoneNumber: string
  message: string
  success: boolean
  firstName: string
  lastName: string
  bio: string
}
