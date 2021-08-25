/** @format */

import React, { useState } from "react";
import ReactDOM from "react-dom";

import { Router } from "@reach/router";
import CurrentResourceContext from "./contexts/current_resource";

import AppLayout from "./containers/app_layout";

import NotFound from "./containers/not_found";
import DashboardContainer from "./containers/dashboard/container";
import RetroContainer from "./containers/retros/container";
import RetroBoard from "./containers/retros/board";
import RetroList from "./containers/retros/list";
import PokerContainer from "./containers/poker/container";
import PokerBoard from "./containers/poker/board";
import PokerList from "./containers/poker/list";

import CheckinContainer from "./containers/checkin/container";
import CheckinList from "./containers/checkin/list";
import CheckinCreate from "./containers/checkin/create/container";

export default function () {
  const [currentResource, setCurrentResource] = useState(window._currentResource);

  return (
    <div className="w-full">
      <CurrentResourceContext.Provider value={currentResource}>
        <Router primary={false}>
          <AppLayout path="/" setCurrentResource={setCurrentResource}>
            <DashboardContainer path="/dashboard"></DashboardContainer>
            <RetroContainer path="/retro">
              <RetroList path="/" default></RetroList>
              <RetroBoard path="board/:boardId"></RetroBoard>
            </RetroContainer>
            <PokerContainer path="/poker">
              <PokerList path="/" default></PokerList>
              <PokerBoard path="board/:boardId"></PokerBoard>
            </PokerContainer>
            {currentResource.checkinEnabled && (
              <CheckinContainer path="/checkin">
                <CheckinList path="/" default></CheckinList>
                <CheckinCreate path="/create"></CheckinCreate>
              </CheckinContainer>
            )}
            <NotFound default />
          </AppLayout>
        </Router>
      </CurrentResourceContext.Provider>
    </div>
  );
}
