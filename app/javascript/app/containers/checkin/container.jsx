/** @format */

import React, { useContext } from "react";
import ReactDOM from "react-dom";
import CurrentResourceContext from "../../contexts/current_resource";

export default function ({ children }) {
  return <div className="w-full h-full">{children}</div>;
}
