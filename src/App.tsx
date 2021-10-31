import React, { useEffect, useState } from "react";
import { Layout, Menu, Breadcrumb } from "antd";
import logo from "./logo.svg";
import AppHeader from "./components/AppHeader";
import { BrowserRouter } from "react-router-dom";
import styled from "styled-components";
import AppRoutes from "./routes";
import authContext from "./context/auth";
import searchInputContext from "./context/search";
const { Content, Footer } = Layout;

const MainContainer = styled(Content)`
  padding: 0 50px;
  margin: 64px auto;
  height: CALC(100vh - 70px);
  width: 80%;
  background: #fff;
  overflow-y: auto;
  &::-webkit-scrollbar-track {
    background-color: #e4e4e4;
    border-radius: 100px;
  }
  
  &::-webkit-scrollbar-thumb {
    border-radius: 100px;
    border: 6px solid rgba(0, 0, 0, 0.18);
    border-left: 0;
    border-right: 0;
    background-color: #8070d4;
  }
`;

function App() {
  const accessToken = window.localStorage.getItem("token");
  const [tokenValid, setTokenValid] = useState<string | null>(accessToken);
  const tempUser = window.localStorage.getItem("user");
  const [user, setuser] = useState(tempUser ? JSON.parse(tempUser) : {});
  const [authenticated, setAuthenticated] = useState<boolean>(
    accessToken ? true : false
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  // useEffect(() => {
  //   setTokenValid(window.localStorage.getItem("token"));
  //   const tempUser = window.localStorage.getItem("user");
  //   setuser(tempUser ? JSON.parse(tempUser) : null);
  //   return () => {
  //     setTokenValid(null);
  //     setSearchQuery("");
  //   };
  // }, [window.localStorage.getItem("token")]);
  return (
    <BrowserRouter>
      <authContext.Provider value={{ authenticated, setAuthenticated }}>
        <searchInputContext.Provider value={{ searchQuery, setSearchQuery }}>
          <Layout >
            <AppHeader
              user={user}
              tokenValid={tokenValid}
              // setSearchQuery={setSearchQuery}
            />
            <MainContainer id="scrollableDiv">
              <div>
                <AppRoutes />
              </div>
            </MainContainer>
          </Layout>
        </searchInputContext.Provider>
      </authContext.Provider>
    </BrowserRouter>
  );
}

export default App;
