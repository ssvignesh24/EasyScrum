/** @format */

import React, { Fragment, useEffect, useState } from "react";
import ReactDOM from "react-dom";

import CompletedImage from "images/completed.png";
import ExpiredImage from "images/expired.png";
import DefaultDp from "images/default_dp.jpg";
import Question from "../app/components/question";
import { Primary as PrimaryButton } from "../app/components/button";

import CheckinClient from "../app/services/checkin";

const App = function () {
  const [state, setState] = useState(_status);
  const [currentResource, _setCurrentResource] = useState(window._currentResource);
  const [questions, _setQuestions] = useState(window._questions);
  const [answers, setAnswers] = useState({});
  const [canSubmit, setCanSubmit] = useState(false);

  const checkinClient = new CheckinClient();

  useEffect(() => () => checkinClient.cancel(), []);

  useEffect(() => {
    let canSubmit_ = true;
    for (const index in questions) {
      const question = questions[index];
      if (!question.is_mandatory) continue;
      if (!answers[question.id] || answers[question.id]?.length == 0) {
        canSubmit_ = false;
        break;
      }
    }
    setCanSubmit(canSubmit_);
  }, [answers]);

  const getDefaultPlaceholder = (answerType) => {
    let placeholder = "Your answer";
    switch (answerType) {
      case "text":
        placeholder = "Text value";
        break;
      case "number":
        placeholder = "Number value";
        break;
    }
    return placeholder;
  };

  const setAnswer = function (question, answer) {
    if (question.answer_type == "dropdown") answer = answer.key;
    setAnswers({ ...answers, [question.id]: answer });
  };

  const submitResponse = () => {
    const search = location.search.substring(1);
    const params = JSON.parse(
      '{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}'
    );
    setState("submitting");
    checkinClient
      .respond(window._checkin.id, params.token, answers)
      .then(({ data }) => {
        if (!data.status) {
          setState("error");
          return;
        }
        setState("success");
      })
      .catch((r) => checkinClient.handleError(r, () => setState("error")));
  };

  return (
    <>
      <div className="container mx-auto">
        <div className="w-6/12 mx-auto py-10">
          <div className="bg-white rounded shadow w-full overflow-hidden ">
            <div className="w-full flex bg-green-500 text-white px-5 py-7">
              <div className="w-6/12">
                <p className="font-medium text-xl">{_checkin.title}</p>
                <p className="text-gray-100">{_issue.date}</p>
              </div>
              <div className="w-6/12">
                <div className="flex float-right">
                  <div className="w-11 h-11 rounded-full mr-3 overflow-hidden">
                    <img src={currentResource.avatarUrl || DefaultDp} className="w-full min-h-full" />
                  </div>
                  <div className="flex flex-col">
                    <p>{currentResource.name || currentResource.email}</p>
                    <p className="text-sm text-gray-100">{currentResource.email}</p>
                  </div>
                </div>
              </div>
            </div>
            {state == "completed" && (
              <>
                <img src={CompletedImage} className="w-7/12 mx-auto" />
                <div className="w-full text-center mt-5 mb-10 text-lg">You have responded to this checkin already</div>
              </>
            )}
            {state == "expired" && (
              <>
                <img src={ExpiredImage} className="w-7/12 mx-auto" />
                <div className="w-10/12 mx-auto text-center mt-5 mb-10 text-lg">{_errorMessage}</div>
              </>
            )}
            {state == "success" && (
              <>
                <div className="w-full text-center mt-5 mb-10 ">
                  <img src={CompletedImage} className="w-7/12 mx-auto" />
                  <p className="font-medium text-xl mb-1.5">Thank you {currentResource.name}!</p>
                  <p className="text-lg">Your response has been submitted successfully.</p>
                </div>
              </>
            )}
            {(state == "init" || state == "submitting") && (
              <>
                <div className="w-full px-5 pt-5 pb-0">
                  {questions &&
                    questions.length > 0 &&
                    questions.map((q, index) => {
                      return (
                        <div key={q.id} className="mb-7 relative" style={{ zIndex: 100 - index }}>
                          <Question
                            prompt={q.prompt}
                            answerType={q.answer_type}
                            placeholder={getDefaultPlaceholder(q.answer_type)}
                            description={q.description}
                            options={q.config}
                            isMandatory={q.is_mandatory}
                            onChange={(a) => setAnswer(q, a)}
                          />
                        </div>
                      );
                    })}
                </div>

                <div className="w-full mt-5 px-5 pt-2 pb-5">
                  <PrimaryButton
                    onClick={submitResponse}
                    className="w-full"
                    disabled={!canSubmit || state == "submitting"}>
                    {state == "submitting" ? "Submitting response..." : "Submit response"}
                  </PrimaryButton>
                  {!canSubmit && (
                    <p className="text-gray-500 mt-3 text-sm text-center">Not all mandatory questions are answered</p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

document.addEventListener("DOMContentLoaded", () => {
  ReactDOM.render(<App name="React" />, document.body.appendChild(document.createElement("div")));
});
