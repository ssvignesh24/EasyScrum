/** @format */

import React, { useState } from "react";
import ReactDOM from "react-dom";

import Header from "../components/header";

export default function ({ children, setCurrentResource }) {
  return (
    <>
      <Header setCurrentResource={setCurrentResource} />
      <div id="stage">{children}</div>
    </>
  );
}
