import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react'

import { useAuth } from '@/core/hooks/api/useAuth'
import { Button } from '@/components/UI/button'
import { Input } from '@/components/UI/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/UI/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/UI/form'

const loginSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email' }),
  password: z.string().min(1, { message: 'Please enter your password' }),
})

export const Route = createFileRoute('/auth/login')({
  component: LoginPage,
})

function LoginPage() {
  const { login, isLoggingIn } = useAuth()
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  function onSubmit(values: z.infer<typeof loginSchema>) {
    login(values)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#111b21] px-0 sm:px-4">
      <Card className="h-screen w-full border-none bg-[#202c33] shadow-2xl sm:h-auto sm:max-w-112.5 sm:rounded-lg">
        <div className="flex justify-center  items-center pb-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#00a884]">
            <Lock className="h-8 w-8 text-white" />
          </div>
        </div>
        <CardHeader className="p-0">
          <CardTitle className="text-center text-xl font-medium text-white">
            Login to ChatApp
          </CardTitle>
          <p className="text-center text-sm text-[#8696a0]">
            Welcome back! Please enter your details.
          </p>
        </CardHeader>

        <CardContent className="mt-4 px-8 pb-12 sm:px-10">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-[#8696a0] text-xs uppercase tracking-wider">
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8696a0]" />
                        <Input
                          placeholder="Email"
                          className="h-11 border-none bg-[#2a3942] pl-10 text-[#e9edef] placeholder:text-[#8696a0] focus-visible:ring-1 focus-visible:ring-[#00a884]"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-[#8696a0] text-xs uppercase tracking-wider">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8696a0]" />
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Password"
                          className="h-11 border-none bg-[#2a3942] pl-10 pr-10 text-[#e9edef] placeholder:text-[#8696a0] focus-visible:ring-1 focus-visible:ring-[#00a884]"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8696a0] hover:text-[#e9edef]"
                        >
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Link
                  to="/auth/forgotPassword"
                  className="text-xs text-[#53bdeb] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button: WhatsApp Teal */}
              <Button
                type="submit"
                className="h-11 w-full bg-[#00a884] font-bold text-[#111b21] hover:bg-[#06cf9c]"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  'LOGIN'
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-10 text-center text-sm">
            <span className="text-[#8696a0]">Don’t have an account?</span>{' '}
            <Link
              to="/auth/register"
              className="font-medium text-[#53bdeb] hover:underline"
            >
              Register
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
