/** @format */

import React, { useState } from "react";
import ReactDOM from "react-dom";

const UserLoading = function () {
  return (
    <div className="flex w-full">
      <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0 "></div>
      <div className="w-full pl-2 py-2">
        <div className="w-60 h-3 bg-gray-200 rounded-lg mb-2.5"></div>
        <div className="w-48 h-2 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  );
};

export { UserLoading };
