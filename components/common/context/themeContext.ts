import React, { createContext } from "react";

export type ColorValues = {
  text_color: string;
  node_color: string;
  headers_color: string;
  background_color: string;
  child_active_connection_color: string;
  parent_active_connection_color: string;
  connection_color: string;
};

const themeContext = createContext<ColorValues | null>(null);

export default themeContext;
