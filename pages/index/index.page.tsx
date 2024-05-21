import Cookies from 'universal-cookie';
import { Form, Input, Checkbox, Button, Alert } from 'antd'
import './index.css';
import { usePageContext } from '../../renderer/usePageContext';

export { Page }

function Page() {
  // not sure why urlParsed isn't in the types, but it works, also make sure "passToClient" contains urlParsed in _default.page.server
  const { urlParsed } = usePageContext();
  const onFinish = ({ username, password, remember }) => {
    console.log('Success');
    const cookies = new Cookies();
    if (remember) {
      cookies.set(import.meta.env.PUBLIC_ENV__AUTH_REMEMBER_COOKIE, true);
    }
    cookies.set(import.meta.env.PUBLIC_ENV__USERNAME_READ_COOKIE, username); // TODO encrypt
    cookies.set(import.meta.env.PUBLIC_ENV__AUTH_READ_COOKIE, password); // TODO encrypt
    window.location.href = '/ywwu';
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="illustration-wrapper">
          {/*<img src="https://mixkit.imgix.net/art/preview/mixkit-left-handed-man-sitting-at-a-table-writing-in-a-notebook-27-original-large.png?q=80&auto=format%2Ccompress&h=700" alt="Login"/>*/}
          <img src="/index-illustration.jpg" alt="Login"/>
        </div>
        <Form
          name="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          {urlParsed.search['loginfailed'] !== undefined && <Alert message="Invalid login credentials." type="error" />}
          <p className="form-title">Welcome back</p>
          <p>Login to Michigan CPA Society Dashboard</p>
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input
              placeholder="Username"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password 
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              LOGIN
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
