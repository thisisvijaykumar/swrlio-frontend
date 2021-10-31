import { createContext } from "react";

const authContext = createContext({
  authenticated: false,
  setAuthenticated: (auth:boolean) => {}
});

export default authContext;