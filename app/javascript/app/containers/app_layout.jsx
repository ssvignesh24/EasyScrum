/** @format */

import React, { useState } from "react";
import ReactDOM from "react-dom";

import Header from "../components/header";
import FeedbackModal from "./feedback_modal";
import { ChatAlt2Icon } from "@heroicons/react/solid";

export default function ({ children, setCurrentResource }) {
  const [showFeedback, setShowFeedback] = useState(false);

  return (
    <>
      <Header setCurrentResource={setCurrentResource} />
      <FeedbackModal open={showFeedback} setOpen={setShowFeedback}></FeedbackModal>
      <div id="stage">{children}</div>
      <div
        onClick={() => setShowFeedback(true)}
        className="fixed flex items-center justify-center bg-green-500 shadow-lg cursor-pointer z-40"
        style={{ bottom: "20px", right: "20px", width: "55px", height: "55px", borderRadius: "50%" }}>
        <ChatAlt2Icon className="w-8 h-8 text-white"></ChatAlt2Icon>
      </div>
    </>
  );
}
