/** @format */

import React, { Fragment, useContext } from "react";
import ReactDOM from "react-dom";
import CurrentResourceContext from "../../../contexts/current_resource";
import to_sentence from "../../../lib/to_sentence";
import QuestionInfo from "../../../components/question_info";
import { Primary as PrimaryButton, Muted as MutedButton } from "../../../components/button";

export default function ({ nextStep, prevStep, checkin }) {
  console.log(checkin);
  return (
    <div className="w-full bg-white rounded shadow overflow-hidden">
      <div className="p-6">
        <p className="text-lg font-medium mb-4">Summary</p>
        <hr />
        <div className="mt-6">
          <div className="mb-4">
            <p className="mb-1 font-medium">Title</p>
            {checkin.title && <p className="">{checkin.title}</p>}
            {!checkin.title && <i className="text-gray-500">No title</i>}
          </div>
          <div className="mb-4">
            <p className="mb-1 font-medium">Description</p>
            {checkin.description && <p className="">{checkin.description}</p>}
            {!checkin.description && <i className="text-gray-500">No description</i>}
          </div>
          <div className="mb-4">
            <p className="mb-1 font-medium">Participant emails</p>
            <div className="flex flex-wrap">
              {checkin.emails.length > 0 &&
                checkin.emails.map((e) => {
                  return (
                    <div key={e} className="bg-green-50 px-3 py-1.5 rounded mr-2 mb-2">
                      {e}
                    </div>
                  );
                })}
              {checkin.emails.length == 0 && <i className="text-gray-500">No participants</i>}
            </div>
          </div>
          <hr className="mb-4" />
          <p className="mb-1 font-medium">Questions</p>
          {checkin.questions.length > 0 &&
            checkin.questions.map((q) => {
              return (
                <Fragment key={q.id_}>
                  <QuestionInfo question={q}></QuestionInfo>
                </Fragment>
              );
            })}

          <hr />
          <div className="my-4">
            <p className="mb-1 font-medium">Schedule</p>
            <p className="">
              Every {to_sentence(checkin.days)} at {checkin.time.name}
            </p>
          </div>
          {checkin.sendReportAt.key != 0 && checkin.reportEmails.length > 0 && (
            <div className="my-4">
              <p className="mb-1 font-medium">Reports</p>
              <p className="">Send report {checkin.sendReportAt.name} the checkin to</p>
              <div className="flex flex-wrap mt-2">
                {checkin.reportEmails.length > 0 &&
                  checkin.reportEmails.map((e) => {
                    return (
                      <div key={e} className="bg-green-50 px-3 py-1.5 rounded mr-2 mb-2">
                        {e}
                      </div>
                    );
                  })}
                {checkin.reportEmails.length == 0 && <i className="text-gray-500">no one</i>}
              </div>
            </div>
          )}
          {(checkin.sendReportAt.key == 0 || checkin.reportEmails.length == 0) && (
            <div className="my-4">
              <p className="mb-1 font-medium">Reports</p>
              <i className="text-gray-500">Don't send reports</i>
            </div>
          )}
        </div>
      </div>
      <div className="p-6 bg-gray-50 flex flex-row-reverse py-3">
        <PrimaryButton onClick={nextStep}>Create checkin</PrimaryButton>
        <MutedButton className="mr-2" onClick={prevStep}>
          Previous step
        </MutedButton>
      </div>
    </div>
  );
}
