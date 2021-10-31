import { Spin } from "antd";
import styled from "styled-components";

const SpinWrapper = styled(Spin)`
  display: block;
  margin: 20px auto;
  padding: 30px 50px;
  text-align: center;
`;

const Spinner = (props:any) => {
  return <SpinWrapper size={props.size ?? "large"} />;
};

export default Spinner;
