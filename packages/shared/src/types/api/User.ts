import { User } from '../User'

export type ApiUser = Omit<User, 'devices' | 'password'>

export type UserGetSelfReq = unknown
export type UserGetSelfRes = { user: ApiUser | null }

export type Tokens = { accessToken: string; refreshToken: string }
export type UserLoginReq = { email: string; password: string }
export type UserLoginRes = { user: ApiUser; tokens: Tokens }

export type UserRegisterReq = Omit<User, 'id' | 'devices'>
export type UserRegisterRes = { user: ApiUser; tokens: Tokens }
