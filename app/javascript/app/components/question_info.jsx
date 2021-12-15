/** @format */

import React, { useState } from "react";
import ReactDOM from "react-dom";
import { TrashIcon } from "@heroicons/react/solid";

export default function ({ question, confirmDeletion }) {
  return (
    <>
      <div className="w-full flex mt-3 mb-6">
        <div className="w-11/12">
          <p className="font-medium">{question.prompt}</p>
          <div className="text-gray-500 flex items-center text-sm">
            <span>{question.answerType.name}</span>
            <div className="mx-2 w-1 h-1 rounded-full bg-gray-500"> </div>
            <span>{question.isMandatory ? "Mandatory" : "Not mandatory"}</span>
            <div className="mx-2 w-1 h-1 rounded-full bg-gray-500"> </div>
            <span>{question.isCritical ? "Critical" : "Not critical"}</span>
          </div>
        </div>
        <div className="w-1/12 flex flex-row-reverse">
          {confirmDeletion && (
            <button
              className="w-6 h-6 cursor-pointer hover:bg-red-50 flex items-center justify-center"
              title="Remove question"
              onClick={confirmDeletion}>
              <TrashIcon className="w-4 h-4 text-red-500"></TrashIcon>
            </button>
          )}
        </div>
      </div>
    </>
  );
}
