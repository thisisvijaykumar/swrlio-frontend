import { Form, Input, Button, Card, notification, Divider } from "antd";
import { NotificationApi } from "antd/lib/notification";
import { useContext } from "react";
import { useHistory } from "react-router";
import styled from "styled-components";
import authContext from "../context/auth";
import HttpService from "../services/http";

const CardWrapper = styled(Card)`
  width: 50%;
  margin: 50px auto;
`;
const Login = () => {
  const history = useHistory();
  const { setAuthenticated } = useContext(authContext);

  const onFinish = (values: any) => {
    console.log("Success:", values);
    debugger;
    handleLogInMethod(values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const handleLogInMethod = (data: any) => {
    HttpService.post("auth/login", data)
      .then((data) => {
        window.localStorage.setItem("token", data.token);
        window.localStorage.setItem("user", JSON.stringify(data.user));
        notification["success"]({
          message: "Successfully logged in",
        });
        setAuthenticated(true);
        history.push("/");
        // window.location.pathname = "/list";
      })
      .catch((err) => {
        notification["error"]({
          message: "Something went wrong",
          description: "please ensure credentials",
        });
        console.log(err);
      });
  };

  return (
    <CardWrapper title="Welcome to Movie List App" style={{textAlign:"center"}}>
      <Form
        style={{ textAlign: "left" }}
        name="login"
        layout="vertical"
        wrapperCol={{ span: 24 }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" shape="round" htmlType="submit" block>
            Log In
          </Button>
        </Form.Item>
      </Form>
      <Divider>Continue without login</Divider>
      <div>
        <Button
          shape="round"
          onClick={() => {
            history.push("/list");
          }}
        >
          Skip
        </Button>
      </div>
    </CardWrapper>
  );
};

export default Login;
