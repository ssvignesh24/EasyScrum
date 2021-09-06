/** @format */

import React, { Fragment, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import CurrentResourceContext from "../../contexts/current_resource";
import pluralize from "pluralize";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { Menu, Transition } from "@headlessui/react";
import _ from "lodash";
import { Link, Redirect } from "@reach/router";
import Scrollbars from "react-custom-scrollbars";

import ConfirmDialog from "../../components/confirmdialog";
import { UserLoading } from "../../components/loading";
import to_sentence from "../../lib/to_sentence";
import DefaultDp from "images/default_dp.jpg";
import WaitingPic from "images/waiting.png";
import CheckinClient from "../../services/checkin";
import { Primary as PrimaryButton } from "../../components/button";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ({ checkinId, issueId }) {
  const checkinClient = new CheckinClient();

  const [state, setState] = useState("loading");
  const [checkin, setCheckin] = useState();

  const [issueState, setIssueState] = useState("loading");
  const [issue, setIssue] = useState();
  const [currentResponse, setCurrentResponse] = useState();

  const [checkinState, setCheckinState] = useState("init");
  const [showConfirmPause, setShowConfirmPause] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [pauseText, setPauseText] = useState("");

  useEffect(() => {
    setIssueState("loading");
    checkinClient
      .getIssue(checkinId, issueId)
      .then(({ data }) => {
        if (!data.status) {
          setState("error");
          return;
        }
        setIssue(data.issue);
        setCurrentResponse(data.issue.responses[0]);
        setIssueState("loaded");
      })
      .catch((r) => checkinClient.handleError(r, () => setState("error")));
  }, [issueId]);

  useEffect(() => {
    checkinClient
      .show(checkinId)
      .then(({ data }) => {
        if (!data.status) {
          setState("error");
          return;
        }
        setCheckin(data.checkin);
        setPauseText(data.checkin.paused ? "Yes, unpause" : "Yes, pause");
        if (data.checkin.issues.length == 0) setState("empty");
        else setState("loaded");
      })
      .catch((r) => checkinClient.handleError(r, () => setState("error")));
    return () => checkinClient.cancel();
  }, []);

  const togglePause = () => {
    setPauseText(checkin.paused ? "Unpausing..." : "Pausing...");
    setCheckinState("pausing");
    checkinClient
      .togglePause(checkin.id)
      .then(({ data }) => {
        if (!data.status) return;
        setShowConfirmPause(false);
        setCheckinState("init");
        setPauseText(data.checkin.paused ? "Yes, unpause" : "Yes, pause");
        setCheckin({ ...checkin, paused: data.checkin.paused });
      })
      .catch((r) => checkinClient.handleError(r));
  };

  const deleteCheckin = () => {
    setCheckinState("deleting");
    checkinClient
      .destroy(checkin.id)
      .then(({ data }) => {
        if (!data.status) return;
        setShowConfirmDelete(false);
        setCheckinState("deleted");
        setState("deleted");
      })
      .catch((r) => checkinClient.handleError(r));
  };

  return (
    <div className="w-full" style={{ height: "calc(100vh - 60px" }}>
      {state == "deleted" && <Redirect to="/checkin" noThrow />}
      <div className="w-full bg-white shadow border-b border-gray-300 z-30 relative flex " style={{ height: "80px" }}>
        {state == "loading" && (
          <div className="w-full h-full px-4 py-6">
            <div className="w-6/12 h-full animate-pulse flex-col items-center">
              <div className="w-72 mb-3 h-3 rounded-lg bg-gray-200"></div>
              <div className="w-48 h-2 rounded bg-gray-200"></div>
            </div>
            <div className="w-6/12"></div>
          </div>
        )}
        {state == "loaded" && (
          <>
            {checkin && (
              <>
                <ConfirmDialog
                  open={showConfirmPause}
                  title={checkin.paused ? "Unpause checkin?" : "Pause checkin?"}
                  body={
                    checkin.paused
                      ? "This action will resumce sending this checkin to the participants. Are you want to proceed?"
                      : "This is will stop sending this checkin to the participants until you unpause. Do you want to procee?"
                  }
                  okText={pauseText}
                  disabled={checkinState == "pausing"}
                  onCancel={() => {
                    setShowConfirmPause(false);
                  }}
                  okButton={PrimaryButton}
                  cancelText="Cancel"
                  onOk={togglePause}
                />
                <ConfirmDialog
                  open={showConfirmDelete}
                  title="Delete checkin?"
                  body="This is will also delete all the responses in this checkin. Are you want to delete the checkin?"
                  okText={checkinState == "init" ? "Yes, Delete" : "Deleting checkin..."}
                  disabled={checkinState == "deleting" || checkinState == "deleted"}
                  onCancel={() => {
                    setShowConfirmDelete(false);
                  }}
                  cancelText="Cancel"
                  onOk={deleteCheckin}
                />
              </>
            )}

            <div className="w-6/12 h-full flex-col px-4 py-4">
              <p className="font-medium">{checkin.title}</p>
              <div className="w-full flex text-sm text-gray-500 items-center">
                {checkin.paused && (
                  <>
                    <div className="text-red-500">Paused</div>
                    <div className="mx-2 w-1 h-1 rounded-full bg-gray-500"> </div>
                  </>
                )}
                <div>{pluralize("Participant", checkin.participantCount, true)}</div>
                <div className="mx-2 w-1 h-1 rounded-full bg-gray-500"> </div>
                <div>
                  Every {to_sentence(checkin.days)} at {checkin.time}
                </div>
              </div>
            </div>
            <div className="w-6/12 flex flex-row-reverse">
              <div className="flex items-center">
                <Menu as="div" className="relative z-30">
                  {({ open }) => (
                    <>
                      <Menu.Button className="mr-3">
                        <PrimaryButton as="div">
                          Checkin options
                          <ChevronDownIcon className="w-5 h-5 text-white"></ChevronDownIcon>
                        </PrimaryButton>
                      </Menu.Button>

                      <Transition
                        show={open}
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95">
                        <Menu.Items
                          static
                          className="origin-top-right absolute right-0 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <div className="py-1">
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  className={classNames(
                                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                                    "block w-full text-left px-4 py-2 text-sm"
                                  )}>
                                  Edit
                                </button>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  onClick={() => {
                                    setShowConfirmPause(true);
                                  }}
                                  className={classNames(
                                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                                    "block w-full text-left px-4 py-2 text-sm"
                                  )}>
                                  {checkin.paused ? "Unpause" : "Pause"}
                                </button>
                              )}
                            </Menu.Item>

                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  onClick={() => setShowConfirmDelete(true)}
                                  className={classNames(
                                    active ? "bg-red-100 text-gray-900" : "text-gray-700",
                                    "block w-full text-left px-4 py-2 text-sm"
                                  )}>
                                  Delete
                                </button>
                              )}
                            </Menu.Item>
                          </div>
                        </Menu.Items>
                      </Transition>
                    </>
                  )}
                </Menu>
              </div>
            </div>
          </>
        )}
      </div>
      {state == "error" && (
        <div className="w-full flex z-28 relative" style={{ height: "calc(100% - 80px)" }}>
          <p>Error loading</p>
        </div>
      )}
      {state == "empty" && <Redirect to={`/checkin/${checkin.id}`} noThrow />}
      {state == "loaded" && (
        <div className="w-full flex z-28 relative" style={{ height: "calc(100% - 80px)" }}>
          <div className="w-3/12 h-full">
            <ul className="w-full h-full">
              <Scrollbars>
                <div className="p-4 border-b border-gray-300">
                  <p className="font-medium">Dates</p>
                </div>
                {checkin.issues.length > 0 &&
                  checkin.issues.map((issue) => {
                    return (
                      <Link to={`/checkin/${checkinId}/issue/${issue.id}`} className="block w-full" key={issue.id}>
                        <li
                          className={
                            "w-full p-4 cursor-pointer bg-opacity-10 border-l-4 " +
                            (issue.id == issueId
                              ? " border-green-500 bg-green-500 "
                              : " hover:bg-gray-500 hover:bg-opacity-10 ")
                          }>
                          <p className="font-medium">{issue.time}</p>
                          <p className="text-gray-500 text-sm">
                            {issue.participants.responded == 0 && <>No participants responded</>}
                            {issue.participants.responded > 0 && (
                              <>
                                {issue.participants.responded} of {issue.participants.total} participants responded
                              </>
                            )}
                          </p>
                        </li>
                      </Link>
                    );
                  })}
              </Scrollbars>
            </ul>
          </div>
          <div className="w-3/12 h-full shadow-lg bg-white border-r border-gray-200">
            <div className="p-4 border-b border-gray-300">
              <p className="font-medium">Participants</p>
            </div>
            {issueState == "loaded" && (
              <>
                <div className="w-full" style={{ height: "calc(100% - 60px)" }}>
                  <Scrollbars>
                    {issue.responses.map((response) => {
                      return (
                        <div
                          className={
                            "p-4 w-full cursor-pointer flex border-l-4 hover:bg-opacity-10  " +
                            (currentResponse?.id == response.id
                              ? "border-green-500 bg-green-500 bg-opacity-10"
                              : "hover:bg-gray-500 border-white hover:border-gray-500 hover:border-opacity-0 ")
                          }
                          onClick={() => setCurrentResponse(response)}
                          key={response.id}>
                          <div className="w-12 h-12 rounded-full bg-green-500 flex-shrink-0 overflow-hidden">
                            <img src={response.participant.avatarUrl || DefaultDp} className="w-full min-h-full" />
                          </div>
                          <div className="w-full pl-2">
                            <p className="font-medium">{response.participant.name || response.participant.email}</p>
                            <p className="text-gray-500 text-sm">{response.participant.email}</p>
                          </div>
                        </div>
                      );
                    })}
                  </Scrollbars>
                </div>
              </>
            )}
            {issueState == "loading" && (
              <div className="animate-pulse">
                {_.times(5, (n) => {
                  return (
                    <div className="p-4 w-full cursor-pointer flex hover:bg-opacity-10 hover:bg-gray-300" key={n}>
                      <UserLoading />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div className="w-6/12 h-full bg-white">
            {issueState == "loaded" && (
              <>
                <div className="p-4 border-b border-gray-300">
                  <div className="flex">
                    <div className="w-12 h-12 rounded-full bg-green-500 flex-shrink-0 overflow-hidden">
                      <img src={currentResponse.participant.avatarUrl || DefaultDp} className="w-full min-h-full" />
                    </div>
                    <div className="w-full pl-2">
                      <p className="font-medium">
                        {currentResponse.participant.name || currentResponse.participant.email}
                      </p>
                      <p className="text-gray-500 text-sm">{currentResponse.participant.email}</p>
                    </div>
                  </div>
                </div>
                {currentResponse.respondedAt && (
                  <div className="w-full p-4" style={{ height: "calc(100% - 80px)" }}>
                    <Scrollbars>
                      {currentResponse.questions.map((question) => {
                        return (
                          <div className="mb-5 border border-gray-300 rounded p-4 shadow" key={question.id}>
                            <p className="font-medium mb-1">
                              {question.prompt}
                              {question.isMandatory && <span className="text-red-500">*</span>}
                            </p>
                            {question.answer && (
                              <p className={question.isBlocker ? "text-red-500" : "text-black"}>
                                {question.answer.value}
                              </p>
                            )}
                            {!question.answer && <i className="text-gray-500">No answer</i>}
                          </div>
                        );
                      })}
                    </Scrollbars>
                  </div>
                )}
                {!currentResponse.respondedAt && (
                  <>
                    <div
                      className="w-full py-32 flex flex-col items-center justify-center"
                      style={{ height: "calc(100% - 80px)" }}>
                      <img src={WaitingPic} style={{ width: "300px" }} />
                      <p>Not yet responded</p>
                    </div>
                  </>
                )}
              </>
            )}
            {issueState == "loading" && (
              <>
                <div className="p-4 w-full border-b border-gray-300 flex animate-pulse">
                  <UserLoading />
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
