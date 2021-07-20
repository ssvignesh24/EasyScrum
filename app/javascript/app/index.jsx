/** @format */

import React, { useEffect, useReducer, useState } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

import { Router, Redirect } from "@reach/router";

import AppLayout from "./containers/app_layout";

import DashboardContainer from "./containers/dashboard/container";
import RetroContainer from "./containers/retros/container";
import RetroBoard from "./containers/retros/board";
import PokerContainer from "./containers/poker/container";

export default function () {
  return (
    <div className="w-full">
      <Router primary={false}>
        <AppLayout path="/">
          <DashboardContainer path="/dashboard"></DashboardContainer>
          <RetroContainer path="/retro">
            <RetroBoard path="board/:board_id"></RetroBoard>
          </RetroContainer>
          <PokerContainer path="/poker"></PokerContainer>
        </AppLayout>
      </Router>
    </div>
  );
}
