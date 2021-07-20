/** @format */

import React, { useEffect, useReducer, useState } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

import { Primary as PrimaryButton } from "../../components/button";
import { Column, Card } from "../../components/retro";
import CreateColumnModal from "./create_column";
import InviteUsersModal from "./invite_users";

export default function ({ children }) {
  const [showCreateColumn, setShowCreateColumn] = useState(false);
  const [showInviteUsersModal, setShowInviteUsersModal] = useState(false);
  return (
    <>
      <CreateColumnModal open={showCreateColumn} setOpen={setShowCreateColumn} afterCreate={() => {}} />
      <InviteUsersModal open={showInviteUsersModal} setOpen={setShowInviteUsersModal} afterInvite={() => {}} />
      <div className="w-full bg-white flex shadow px-5" style={{ height: "80px" }}>
        <div className="w-9/12 h-full flex justify-center flex-col">
          <p className="font-medium text-lg ">Sprint 1/4 Retro</p>
          <p className="text-gray-500 text-sm">5 Participants</p>
        </div>
        <div className="w-3/12 flex items-center flex-row-reverse">
          <PrimaryButton>Action items</PrimaryButton>
          <PrimaryButton onClick={() => setShowCreateColumn(true)} className="mr-3">
            Add column
          </PrimaryButton>
          <PrimaryButton className="mr-3" onClick={() => setShowInviteUsersModal(true)}>
            Invite users
          </PrimaryButton>
        </div>
      </div>
      <div
        className="w-full pt-3 pl-3"
        style={{ height: "calc(100vh - 140px)", overflowX: "hidden", overflowY: "auto" }}>
        <div className="whitespace-nowrap h-full" style={{ overflowY: "auto" }}>
          <Column>
            <Card></Card>
            <Card></Card>
            <Card></Card>
            <Card></Card>
            <Card></Card>
            <Card></Card>
            <Card></Card>
            <Card></Card>
          </Column>
          <Column>
            <Card></Card>
            <Card></Card>
          </Column>
          <Column>
            <Card></Card>
            <Card></Card>
          </Column>
          <Column>
            <Card></Card>
            <Card></Card>
          </Column>
          <Column>
            <Card></Card>
            <Card></Card>
          </Column>
          <Column>
            <Card></Card>
            <Card></Card>
          </Column>
          <Column>
            <Card></Card>
            <Card></Card>
          </Column>
        </div>
      </div>
    </>
  );
}
