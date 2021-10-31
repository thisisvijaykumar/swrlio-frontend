import { Button, Col, Menu, Row } from "antd";
import Search from "antd/lib/input/Search";
import { Header } from "antd/lib/layout/layout";
import Title from "antd/lib/typography/Title";
import React, { useContext, useState } from "react";
import styled from "styled-components";
import { debounce } from "debounce";
import { useHistory, useLocation } from "react-router-dom";

import Logo from "./../../assets/images/logo.svg";
import authContext from "../../context/auth";
import searchInputContext from "../../context/search";
const HeaderWrapper = styled(Header)`
  position: fixed;
  z-index: 1;
  width: 100%;
  .logo img {
    float: left;
    width: 100px;
    height: 30px;
    margin: 16px 24px 16px 0;
  }
`;
interface Props {
  user: any;
  tokenValid: string | null;
}
const getSearchQuery = (search: string | null) => {
  const params = new URLSearchParams(search ?? "");
  return params.get("q");
};

export default function AppHeader(props: Props) {
  const { authenticated } = useContext(authContext);
  const { searchQuery, setSearchQuery } = useContext(searchInputContext);

  const history = useHistory();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  // const [query, setQuery] = useState<string | null>(searchQuery);
  const [authPage, setAuthPage] = useState(
    location.pathname.includes("signup") || location.pathname.includes("login")
  );
  console.log(location, authPage, "location");
  // setSearchQuery(getSearchQuery(location.search) ?? "");
  const handleAuthButton = (path: string) => {
    if (path === "signout") {
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("user");
      window.location.pathname = "/login";
      // history.push("all");
    } else {
      history.push(`${path}`);
    }
  };
  let handleSearch = (value: string) => {
    debugger;
    const length = value.length;
    if (length < 2) {
      if (length === 0) {
        setSearchQuery("");
        history.push(location.pathname);
      }
      return;
    }
    setSearchQuery(value);
    // setQuery(value);
    history.push({
      pathname: location.pathname,
      search: `q=${value}`,
    });
  };
  handleSearch = debounce(handleSearch, 500);
  return (
    <HeaderWrapper>
      <Row gutter={8} align="middle">
        <Col span={6}>
          <div className="logo">
            <a href="/">
              <img src={Logo} alt="My Movie Rating" />
            </a>
          </div>
        </Col>
        <Col span={10}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {!authPage && (
              <Search
                placeholder="Please type atleast 2 characters to seach movie"
                allowClear
                defaultValue={searchQuery ?? ""}
                onChange={(e) => handleSearch(e.target.value)}
                // onSearch={(value) => handleSearch(value)}
              />
            )}
          </div>
        </Col>
        <Col span={8}>
          <div style={{ textAlign: "right" }}>
            {!authenticated && (
              <>
                {!location.pathname.includes("/signup") && (
                  <Button
                    type="primary"
                    ghost
                    onClick={() => handleAuthButton("signup")}
                  >
                    Create Account
                  </Button>
                )}{" "}
                &nbsp;
                {!location.pathname.includes("/login") && (
                  <Button
                    type="primary"
                    ghost
                    onClick={() => handleAuthButton("login")}
                  >
                    Log In
                  </Button>
                )}
              </>
            )}
            {authenticated && (
              <>
                <Button
                  type="primary"
                  ghost
                  danger
                  onClick={() => handleAuthButton("signout")}
                >
                  Sign Out
                </Button>
              </>
            )}
          </div>
        </Col>
      </Row>
    </HeaderWrapper>
  );
}
