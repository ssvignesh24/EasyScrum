/** @format */

import React, { useEffect, useReducer, useState } from "react";
import ReactDOM from "react-dom";
import { ArrowLeftIcon } from "@heroicons/react/solid";
import { Link, Redirect } from "@reach/router";

import titleize from "../../lib/titleize";
import CheckinClient from "../../services/checkin";
import Progress from "./create/progress";
import StepOne from "./create/step_one";
import StepTwo from "./create/step_two";
import StepThree from "./create/step_three";
import StepFour from "./create/step_four";

const checkinReducer = (state, action) => {
  switch (action.type) {
    case "set":
      return {
        ...action.checkin,
      };
    case "step_one":
      return {
        ...state,
        emails: action.emails,
        title: action.title,
        description: action.description,
        emailStr: action.emailStr,
      };
    case "step_two":
      return { ...state, questions: action.questions };
    case "step_three":
      return {
        ...state,
        days: action.days,
        time: action.time,
        sendReportAt: action.sendReportAt,
        reportEmails: action.reportEmails,
        reportEmailsStr: action.reportEmailsStr,
      };
  }
};

export default function ({ checkinId }) {
  const checkinClient = new CheckinClient();

  const [state, setState] = useState("loading");
  const [currentStep, setCurrentStep] = useState(1);
  const [checkin, checkinDispatch] = useReducer(checkinReducer, {});

  useEffect(() => {
    checkinClient.edit(checkinId).then(({ data }) => {
      if (!data.status) {
        setState("error");
        return;
      }
      const checkin_ = data.checkin;
      checkin_.questions = checkin_.questions.map((q) => {
        q.answer_type = q.answerType;
        if (q.answerType == "rating5") q.answerType = { key: "rating5", name: "Rating (0-5)" };
        else if (q.answerType == "rating10") q.answerType = { key: "rating10", name: "Rating (0-10)" };
        else q.answerType = { key: q.answerType, name: titleize(q.answerType) };
        q.is_mandatory = q.isMandatory;
        q.isCritical = q.isBlocker;
        return q;
      });
      checkin_.emailStr = checkin_.participants.map((p) => p.email).join(", ");
      checkin_.time = { key: checkin_.time, name: checkin_.time };
      checkin_.sendReportAt = { key: checkin_.reportAfter, name: getReportLabel(checkin_.reportAfter) };
      checkin_.reportEmailsStr = checkin_.reportEmails.join(", ");
      checkinDispatch({ type: "set", checkin: checkin_ });
      setState("loaded");
    });
    return () => checkinClient.cancel();
  }, []);

  const getReportLabel = (key) => {
    if (key == 0) return "Don't send reports";
    else if (key == 1) return "1 hour after sending";
    else return `${key} hours after sending`;
  };

  const createCheckin = () => {
    const payload = {
      id: checkin.id,
      title: checkin.title,
      description: checkin.description,
      emails: checkin.emails,
      questions: checkin.questions,
      days: checkin.days,
      time: checkin.time.key,
      send_report_at: checkin.sendReportAt.key,
      report_emails: checkin.reportEmails,
    };
    setState("creating");
    checkinClient
      .update(payload)
      .then(({ data }) => {
        if (!data.status) return;
        setState("updated");
      })
      .catch((r) =>
        checkinClient.handleError(r, ({ response }) => {
          setState("error");
        })
      );
  };

  return (
    <div className="container mx-auto">
      {state == "updated" && <Redirect to="/checkin" noThrow />}
      <div className="w-10/12 mx-auto mt-4">
        <div className="py-3 px-3 flex">
          <div className="w-3/12x h-1"></div>
          <div className="w-9/12 ">
            {state == "loaded" && (
              <>
                {checkin.lastIssueId && (
                  <Link to={`/checkin/${checkinId}/issue/${checkin.lastIssueId}`}>
                    <div className="flex text-green-500 items-center mb-1">
                      <ArrowLeftIcon className="w-4 h-4 mr-1"></ArrowLeftIcon>
                      <span className="">Back to checkin</span>
                    </div>
                  </Link>
                )}
                {!checkin.lastIssueId && (
                  <Link to={`/checkin/${checkinId}`}>
                    <div className="flex text-green-500 items-center mb-1">
                      <ArrowLeftIcon className="w-4 h-4 mr-1"></ArrowLeftIcon>
                      <span className="">Back to checkin</span>
                    </div>
                  </Link>
                )}
              </>
            )}
            <p className="text-xl font-medium">Edit checkin</p>
          </div>
        </div>
        {state == "loaded" && (
          <div className="flex px-3 mt-3 mb-10">
            <div className="w-3/12">
              <Progress currentStep={currentStep}></Progress>
            </div>
            <div className="w-9/12">
              {currentStep == 1 && (
                <StepOne checkin={checkin} dispatch={checkinDispatch} nextStep={() => setCurrentStep(2)}></StepOne>
              )}
              {currentStep == 2 && (
                <StepTwo
                  checkin={checkin}
                  dispatch={checkinDispatch}
                  nextStep={() => setCurrentStep(3)}
                  prevStep={() => setCurrentStep(1)}></StepTwo>
              )}
              {currentStep == 3 && (
                <StepThree
                  checkin={checkin}
                  dispatch={checkinDispatch}
                  nextStep={() => setCurrentStep(4)}
                  prevStep={() => setCurrentStep(2)}></StepThree>
              )}
              {currentStep == 4 && (
                <StepFour checkin={checkin} nextStep={createCheckin} prevStep={() => setCurrentStep(3)}></StepFour>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
