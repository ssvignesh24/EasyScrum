/** @format */

import React, { useContext, useState } from "react";
import ReactDOM from "react-dom";
import SelectBox from "../../../components/select_box";
import InputField from "../../../components/input_fields";

import { Primary as PrimaryButton, Muted as MutedButton } from "../../../components/button";
let times = [];
for (let min = 0; min < 60; min = min + 10) {
  let min_ = min == 0 ? "00" : min;
  let label = `12:${min_}AM`;
  times.push({ key: label, name: label });
}
for (let hr = 1; hr < 12; hr++) {
  for (let min = 0; min < 60; min = min + 10) {
    let min_ = min == 0 ? "00" : min;
    let label = `${hr}:${min_}AM`;
    times.push({ key: label, name: label });
  }
}
for (let min = 0; min < 60; min = min + 10) {
  let min_ = min == 0 ? "00" : min;
  let label = `12:${min_}PM`;
  times.push({ key: label, name: label });
}
for (let hr = 1; hr < 12; hr++) {
  for (let min = 0; min < 60; min = min + 10) {
    let min_ = min == 0 ? "00" : min;
    let label = `${hr}:${min_}PM`;
    times.push({ key: label, name: label });
  }
}

const reportTimes = [
  { key: 0, name: "Don't send reports" },
  { key: 1, name: "1 hour after sending" },
  { key: 2, name: "2 hours after sending" },
  { key: 3, name: "3 hours after sending" },
  { key: 4, name: "4 hours after sending" },
  { key: 5, name: "5 hours after sending" },
  { key: 6, name: "6 hours after sending" },
  { key: 7, name: "7 hours after sending" },
  { key: 8, name: "8 hours after sending" },
  { key: 9, name: "9 hours after sending" },
  { key: 10, name: "10 hours after sending" },
  { key: 12, name: "12 hours after sending" },
  { key: 15, name: "15 hours after sending" },
  { key: 18, name: "18 hours after sending" },
  { key: 24, name: "24 hours after sending" },
];

export default function ({ dispatch, checkin, nextStep, prevStep }) {
  const [days, setDays] = useState(checkin.days || []);
  const [time, setTime] = useState(checkin.time || times[0]);
  const [sendReportAt, setSendReportAt] = useState(checkin.sendReportAt || reportTimes[0]);
  const [reportEmails, setReportEmails] = useState(checkin.reportEmailsStr || "");
  const [errors, setErrors] = useState({});

  const saveAndMove = () => {
    let emailError = 0;
    const reportEmailsArray = reportEmails
      .split(",")
      .map((e) => {
        const email = e.trim();
        if (!email) return false;
        if (email.split("@").length != 2) emailError += 1;
        return email;
      })
      .filter((e) => !!e);

    if (emailError > 0) {
      setErrors((e) => {
        return {
          ...e,
          emails:
            emailError == 1
              ? "Invalid email address present in the report recipient email list"
              : "Invalid email addresses present in the report recipient email list",
        };
      });
      return;
    }

    dispatch({
      type: "step_three",
      days,
      time,
      sendReportAt,
      reportEmails: reportEmailsArray,
      reportEmailsStr: reportEmails,
    });
    nextStep();
  };

  const toggleDay = (day) => {
    if (days.indexOf(day) > -1) {
      setDays(days.filter((d) => d != day));
    } else {
      setDays((days_) => days_.concat(day));
    }
  };
  return (
    <div className="w-full bg-white rounded shadow overflow-hidden">
      <div className="p-6">
        <p className="text-lg font-medium mb-4">Scheduling & Reporting</p>
        <hr />
        <div className="mt-6">
          <p className="mb-2">Which days should we send this checkin?</p>
          <div className="flex flex-wrap">
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((d) => {
              return (
                <div
                  key={d}
                  onClick={() => toggleDay(d)}
                  className={
                    "px-3 py-1.5 border rounded mr-1.5 mb-1.5 cursor-pointer transition-colors " +
                    (days.indexOf(d) > -1
                      ? "border-green-500 bg-green-100"
                      : "bg-white border-gray-200 hover:bg-green-50 ")
                  }>
                  {d}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6 z-30 relative">
          <p className="mb-2">At what time should we send this checkin?</p>
          <SelectBox
            options={times}
            selected={time}
            onChange={(value) => {
              setTime(value);
            }}
          />
        </div>

        <hr className="my-6" />

        <div className="mt-6 z-28 relative">
          <p className="mb-2">At time should we send this checkin's report?</p>
          <SelectBox
            options={reportTimes}
            selected={sendReportAt}
            onChange={(value) => {
              setSendReportAt(value);
            }}
          />
        </div>

        <div className="mt-6 mb-3">
          <p className="mb-0 font-mediumx">Whome do you want to send the checkin reports to?</p>
          <p className="mb-2 text-sm text-gray-500">Separate emails by comma</p>
          <InputField.TextArea
            defaultValue={reportEmails}
            error={errors.emails}
            onChange={setReportEmails}
            placeholder="Eg. ross@easyscrum.co, rachel@easyscrum.co, joey@easyscrum.co, monica@easyscrum.co, chandler@easyscrum.co"
            className="sm:text-base"></InputField.TextArea>
        </div>
      </div>
      <div className="p-6 bg-gray-50 flex flex-row-reverse py-3">
        <PrimaryButton disabled={days.length == 0} onClick={saveAndMove}>
          Next step
        </PrimaryButton>
        <MutedButton className="mr-2" onClick={prevStep}>
          Previous step
        </MutedButton>
      </div>
    </div>
  );
}
