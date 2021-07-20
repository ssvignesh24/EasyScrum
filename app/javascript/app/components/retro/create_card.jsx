/** @format */

import React, { useEffect, useReducer, useState } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

import { Primary as PrimaryButton, Muted as MutedButton } from "../button";

export default function ({ children }) {
  const [showForm, setShowForm] = useState(false);

  const toggleForm = () => setShowForm(!showForm);

  return (
    <>
      {!showForm && (
        <button onClick={toggleForm} className="w-full p-3 bg-white shadow rounded mb-3 text-center">
          Add a card
        </button>
      )}
      {showForm && (
        <div className="w-full p-3 bg-white shadow rounded mb-3">
          <textarea
            className="bg-gray-100 border-0 w-full rounded p-2 outline-none text-sm"
            placeholder="Your comment"></textarea>
          <div className="flex flex-row-reverse mt-2">
            <PrimaryButton size="sm">
              <span className="text-sm">Add card</span>
            </PrimaryButton>
            <MutedButton onClick={toggleForm} size="sm" className="mr-2">
              Cancel
            </MutedButton>
          </div>
        </div>
      )}
    </>
  );
}
