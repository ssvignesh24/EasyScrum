/** @format */

import React, { useState } from "react";
import ReactDOM from "react-dom";

import { Router } from "@reach/router";
import CurrentResourceContext from "./contexts/current_resource";

import PowerLayout from "./containers/power/container";
import PowerHome from "./containers/power/home";
import UsersList from "./containers/power/users/list";
import User from "./containers/power/users/show";
import FeatureList from "./containers/power/features/list";
import FeedbackList from "./containers/power/feedbacks/list";

export default function () {
  const [currentResource, setCurrentResource] = useState(window._currentResource);

  return (
    <div className="w-full">
      <CurrentResourceContext.Provider value={currentResource}>
        <Router primary={false}>
          <PowerLayout path="/power" setCurrentResource={setCurrentResource}>
            <PowerHome path="/"></PowerHome>
            <UsersList path="/users"> </UsersList>
            <User path="/users/:userId"> </User>
            <FeatureList path="/features"></FeatureList>
            <FeedbackList path="/feedbacks"></FeedbackList>
          </PowerLayout>
        </Router>
      </CurrentResourceContext.Provider>
    </div>
  );
}
