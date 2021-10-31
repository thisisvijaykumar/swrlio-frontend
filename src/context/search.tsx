import { createContext } from "react";

const searchInputContext = createContext({
  searchQuery: "",
  setSearchQuery: (value: string) => {},
});

export default searchInputContext;
