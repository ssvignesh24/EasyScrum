/** @format */

import React, { Fragment, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import CurrentResourceContext from "../../contexts/current_resource";
import _ from "lodash";
import { Link, Redirect } from "@reach/router";
import Scrollbars from "react-custom-scrollbars";

import { UserLoading } from "../../components/loading";
import DefaultDp from "images/default_dp.jpg";
import ErrorImage from "images/error.png";
import WaitingPic from "images/waiting.png";
import CheckinClient from "../../services/checkin";
import CheckinHeader from "./header";

export default function ({ checkinId, issueId }) {
  const checkinClient = new CheckinClient();

  const [state, setState] = useState("loading");
  const [checkin, setCheckin] = useState();

  const [issueState, setIssueState] = useState("loading");
  const [issue, setIssue] = useState();
  const [currentResponse, setCurrentResponse] = useState();

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
        if (data.checkin.issues.length == 0) setState("empty");
        else setState("loaded");
      })
      .catch((r) => checkinClient.handleError(r, () => setState("error")));
    return () => checkinClient.cancel();
  }, []);

  const onPause = (isPaused) => {
    setCheckin({ ...checkin, paused: isPaused });
  };

  const afterDelete = () => {
    setState("deleted");
  };

  return (
    <div className="w-full" style={{ height: "calc(100vh - 60px" }}>
      {state == "deleted" && <Redirect to="/checkin" noThrow />}
      <CheckinHeader checkin={checkin} onPause={onPause} afterDelete={afterDelete}></CheckinHeader>
      {state == "error" && (
        <div className="w-full flex z-28 relative" style={{ height: "calc(100% - 80px)" }}>
          <div className="py-20 w-full">
            <img src={ErrorImage} className="mx-auto" style={{ width: "350px" }} />
            <p className="mt-10 text-center">Something went wrong while loading checkin!</p>
          </div>
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
                          <div className="w-12 h-12 rounded-full bg-green-200 flex-shrink-0 overflow-hidden">
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
                    <div className="w-12 h-12 rounded-full bg-green-200 flex-shrink-0 overflow-hidden">
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
