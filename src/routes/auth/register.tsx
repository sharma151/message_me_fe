import { useAuth } from '@/core/hooks/api/useAuth'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Form, Input, Button, Typography, Grid, Card } from 'antd'
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  LockOutlined,
  MailOutlined,
  UserOutlined,
} from '@ant-design/icons'
const { Title, Text } = Typography
const { useBreakpoint } = Grid
export const Route = createFileRoute('/auth/register')({
  component: RegisterForm,
})

function RegisterForm() {
  const { register, isRegistering } = useAuth()
  const [RegisterForm] = Form.useForm()
  const screens = useBreakpoint()

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <Card
        className="w-full"
        style={{
          maxWidth: screens.sm ? 420 : '100%',
        }}
      >
        <Title level={3} className="text-center">
          Register
        </Title>

        <Form
          form={RegisterForm}
          layout="vertical"
          onFinish={register}
          requiredMark={false}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please enter your name' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Enter your name" />
          </Form.Item>
          {/* Username */}
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Enter a valid email' },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Enter your email" />
          </Form.Item>

          {/* Password */}
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Enter your password"
              iconRender={(visible: unknown) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          {/* Submit */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isRegistering}
              block
            >
              {isRegistering ? 'Registering...' : 'Register'}
            </Button>
          </Form.Item>
        </Form>

        {/* Register */}
        <div className="text-center">
          <Text type="secondary">Do you have an account?</Text>{' '}
          <Link
            to="/auth/login"
            className="font-medium text-blue-600 hover:underline"
          >
            Login
          </Link>
        </div>
      </Card>
    </div>
  )
}
