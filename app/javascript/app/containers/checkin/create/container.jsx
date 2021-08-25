/** @format */

import { ArrowLeftIcon } from "@heroicons/react/solid";
import { Link } from "@reach/router";
import React, { useReducer, useState } from "react";
import ReactDOM from "react-dom";

import Progress from "./progress";
import StepOne from "./step_one";
import StepTwo from "./step_two";
import StepThree from "./step_three";
import StepFour from "./step_four";

const checkinReducer = (state, action) => {
  switch (action.type) {
    case "step_one":
      return {
        ...state,
        emails: action.emails,
        title: action.title,
        desscription: action.desscription,
        emailStr: action.emailStr,
      };
    case "step_two":
      console.log(action);
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

export default function () {
  const [currentStep, setCurrentStep] = useState(1);
  const [checkin, checkinDispatch] = useReducer(checkinReducer, {});

  const createCheckin = () => {};

  return (
    <div className="container mx-auto">
      <div className="w-10/12 mx-auto mt-4">
        <div className="py-3 px-3 flex">
          <div className="w-3/12x h-1"></div>
          <div className="w-9/12 ">
            <Link to="/checkin">
              <div className="flex text-green-500 items-center mb-1">
                <ArrowLeftIcon className="w-4 h-4 mr-1"></ArrowLeftIcon>
                <span className="">Back to all checkins</span>
              </div>
            </Link>
            <p className="text-xl font-medium">Create checkin</p>
          </div>
        </div>

        <div className="flex px-3 mt-3">
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
      </div>
    </div>
  );
}
