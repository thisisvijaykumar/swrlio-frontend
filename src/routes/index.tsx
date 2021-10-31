
import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import HomePage from "../pages/home";
import Login from "../pages/login";
import SignUp from "../pages/sign-up";

const AppRoutes: React.FC = () => {
  return (
    <Switch>
      {/* <Route path="/my-movies" component={MyMovies} /> */}
      
      <Route path="/login" component={Login} />
      <Route path="/signup" component={SignUp} />
      <Route path="/list" component={HomePage} />
      <Redirect exact from="/" to="/list" />
    </Switch>
  );
};
export default AppRoutes;
