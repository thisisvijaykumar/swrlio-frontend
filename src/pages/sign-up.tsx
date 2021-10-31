import { Form, Input, Button, Card, notification, Divider } from "antd";
import { useContext } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import authContext from "../context/auth";
import HttpService from "../services/http";

const CardWrapper = styled(Card)`
  width: 50%;
  margin: 50px auto;
  textalign: "center";
`;
const SignUp = () => {
  const { setAuthenticated } = useContext(authContext);
  const history = useHistory();
  const onFinish = (values: any) => {
    console.log("Success:", values);
    debugger;
    handleSignUpMethod(values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const handleSignUpMethod = (data: any) => {
    HttpService.post("auth/signup", data)
      .then((data) => {
        console.log(data);
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
          description: "please ensure input details",
        });
        console.log(err);
      });
  };

  return (
    <CardWrapper title="Welcome to Movie List App" style={{textAlign:"center"}} >
      <Form
        name="signup"
        layout="vertical"
        wrapperCol={{ span: 24 }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please input your full name!" }]}
        >
          <Input />
        </Form.Item>

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
            Sign Up
          </Button>
        </Form.Item>
      </Form>
      <Divider>Continue without registering</Divider>
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

export default SignUp;
