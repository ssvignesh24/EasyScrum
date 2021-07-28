/** @format */

import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

import { Primary as PrimaryButton, Muted as MutedButton } from "../button";

import Retro from "../../services/retro";

export default function ({ children, addCard, boardId, columnId }) {
  const retroClient = new Retro(boardId);
  const newCardField = useRef();

  const [showForm, setShowForm] = useState(false);
  const [state, setState] = useState("ready");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!showForm) return;
    newCardField.current.focus();
  }, [showForm]);

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const createCard = () => {
    const payload = { message };
    setState("creating");
    retroClient
      .createCard(columnId, { card: payload })
      .then(({ data }) => {
        if (!data.status) return;
        addCard(columnId, data.card);
        setShowForm(false);
        setMessage("");
        setState("ready");
      })
      .catch((r) => retroClient.handleError(r));
  };

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
            placeholder="Your message"
            value={message}
            ref={newCardField}
            onChange={(e) => setMessage(e.target.value)}></textarea>
          <div className="flex flex-row-reverse mt-2">
            <PrimaryButton size="sm" onClick={createCard} disabled={!message || state == "creating"}>
              {state == "creating" && <span className="text-sm">Adding card...</span>}
              {state == "ready" && <span className="text-sm">Add card</span>}
            </PrimaryButton>
            <MutedButton onClick={toggleForm} size="sm" className="mr-2">
              <span className="text-sm">Cancel</span>
            </MutedButton>
          </div>
        </div>
      )}
    </>
  );
}