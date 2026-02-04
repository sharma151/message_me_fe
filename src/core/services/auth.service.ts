import httpBase from '@/core/services/httpBase'
import { AxiosError } from 'axios'
import { handleError } from '@/utils/http.utils'
import type {
  AuthResponse,
  LoginFormInterface,
  RegisterFormInterface,
  UserProfileResponse,
} from '@/@types/forms/auth'
import type { AxiosResponseInterface } from '@/@types/response/api-response'

// --- API Functions ---

class AuthService {
  // User Login
  static async login(credential: LoginFormInterface) {
    try {
      const response: AxiosResponseInterface<AuthResponse> =
        await httpBase.post('/auth/login', credential)
      return response?.data?.data
    } catch (error) {
      throw handleError(error as AxiosError)
    }
  }

  // User Registration
  static async register(formData: RegisterFormInterface) {
    try {
      const response: AxiosResponseInterface<RegisterFormInterface> =
        await httpBase.post('/auth/signup', formData)
      return response
    } catch (error) {
      throw handleError(error as AxiosError)
    }
  }

  //Fetch LoggedinProfile Details

  static async fetchLoggedinProfile() {
    try {
      const response: AxiosResponseInterface<UserProfileResponse> =
        await httpBase.get('/auth/me')
      return response
    } catch (error) {
      throw handleError(error as AxiosError)
    }
  }

  // User Logout
  //   static async logout() {
  //     try {
  //       const response: AxiosResponseInterface<unknown> =
  //         await httpBase.post("/users/logout");
  //       return response;
  //     } catch (error) {
  //       throw handleError(error as AxiosError);
  //     }
  //   }
}
export default AuthService
