/** @format */

import React, { useEffect, useReducer, useState } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

import Header from "../components/header";

export default function ({ children }) {
  return (
    <>
      <Header />
      <div id="stage">{children}</div>
    </>
  );
}
