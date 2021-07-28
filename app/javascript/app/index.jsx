/** @format */

import React, { useEffect, useReducer, useState } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

import { Router, Redirect } from "@reach/router";

import AppLayout from "./containers/app_layout";

import DashboardContainer from "./containers/dashboard/container";
import RetroContainer from "./containers/retros/container";
import RetroBoard from "./containers/retros/board";
import RetroList from "./containers/retros/list";
import PokerContainer from "./containers/poker/container";
import PokerBoard from "./containers/poker/board";
import PokerList from "./containers/poker/list";

export default function () {
  return (
    <div className="w-full">
      <Router primary={false}>
        <AppLayout path="/">
          <DashboardContainer path="/dashboard"></DashboardContainer>
          <RetroContainer path="/retro">
            <RetroList path="/" default></RetroList>
            <RetroBoard path="board/:boardId"></RetroBoard>
          </RetroContainer>
          <PokerContainer path="/poker">
            <PokerList path="/" default></PokerList>
            <PokerBoard path="board/:boardId"></PokerBoard>
          </PokerContainer>
        </AppLayout>
      </Router>
    </div>
  );
}
