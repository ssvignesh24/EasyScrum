/** @format */

import React, { useEffect, useReducer, useState } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

export default function ({ children }) {
  return (
    <>
      <h1>Retro container</h1>
      {children}
    </>
  );
}
