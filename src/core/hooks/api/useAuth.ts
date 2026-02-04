import { useMutation, useQuery } from '@tanstack/react-query'
import AuthService from '@/core/services/auth.service'
import { useAuthStore } from '@/store/auth.store'
import { useToast } from '@/core/hooks/common/useToast'
import { useNavigate } from '@tanstack/react-router'
import type {
  LoginFormInterface,
  RegisterFormInterface,
} from '@/@types/forms/auth'
export const useAuth = () => {
  const loginStore = useAuthStore((state) => state.login)
  const navigate = useNavigate()
  const { success: Success } = useToast()

  // LOGIN
  const loginMutation = useMutation({
    mutationFn: async (payload: LoginFormInterface) =>
      await AuthService.login(payload),

    onSuccess: (data) => {
      console.log('Login Success Data:', data)
      loginStore({
        user: {
          id: data?.user?.id.toString() || '',
          name: data?.user?.name || '',
          email: data?.user?.email || '',
        },
        accessToken: data?.access_token || '',
      })

      navigate({ to: '/chats' })
      Success('Logged in successfully')
    },
  })

  // REGISTER
  const registerMutation = useMutation({
    mutationFn: (payload: RegisterFormInterface) =>
      AuthService.register(payload),
    onSuccess: () => {
      navigate({ to: '/auth/login' })
      Success('Registration successful. Please login.')
    },
  })

  //Fetch LoggedIn user PROFILE DETAIL

  // const UserProfileDetail = useQuery({
  //   queryKey: ['profiledetail'],
  //   queryFn: AuthService.fetchLoggedinProfile,
  // })

  return {
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
    // userdetail: UserProfileDetail.data?.data?.data,
  }
}
