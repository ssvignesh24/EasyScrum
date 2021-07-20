/** @format */

import React, { useEffect, useReducer, useState } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { Link } from "@reach/router";

export default function ({ children }) {
  const isActive = ({ isCurrent, isPartiallyCurrent }) => {
    let class_name =
      "flex items-center px-5 text-white h-full cursor-pointer border-b-4 hover:bg-black hover:bg-opacity-10 ";
    class_name += isPartiallyCurrent ? "border-green-500" : "border-transparent";
    return { className: class_name };
  };
  return (
    <>
      <div className="fixed w-full" style={{ top: 0, left: 0, height: "60px", background: "#2e3740" }}>
        <div className="flex h-full">
          <Link to="/dashboard" getProps={isActive}>
            Dashboard
          </Link>
          <Link to="/retro" getProps={isActive}>
            Retrospective
          </Link>
          <Link to="/poker" getProps={isActive}>
            Planning poker
          </Link>
        </div>
      </div>
    </>
  );
}
