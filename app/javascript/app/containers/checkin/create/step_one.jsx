/** @format */

import React, { useContext, useState } from "react";
import ReactDOM from "react-dom";
import { Primary as PrimaryButton } from "../../../components/button";
import InputField from "../../../components/input_fields";

export default function ({ dispatch, checkin, nextStep }) {
  const [title, setTitle] = useState(checkin.title || "");
  const [description, setDescription] = useState(checkin.description || "");
  const [emails, setEmails] = useState(checkin.emailStr || "");
  const [errors, setErrors] = useState({});

  const saveAndMove = () => {
    let hasError = false;
    if (!title) {
      setErrors({ title: "Checkin title is empty" });
      hasError = true;
    }
    if (!emails) {
      setErrors((e) => {
        return { ...e, emails: "Atleast one participant must be present" };
      });
      hasError = true;
    }
    let emailError = 0;

    const allEmails = emails.split(",").map((e) => {
      const email = e.trim();
      if (email.split("@").length != 2) emailError += 1;
      return email;
    });

    if (emailError > 0)
      setErrors((e) => {
        return {
          ...e,
          emails:
            emailError == 1
              ? "Invalid email address present in the participant email list"
              : "Invalid email addresses present in the participant email list",
        };
      });

    if (hasError || emailError > 0) return;
    setErrors({});
    dispatch({ type: "step_one", title, description, emails: allEmails, emailStr: emails });
    nextStep();
  };

  return (
    <div className="w-full bg-white rounded shadow overflow-hidden">
      <div className="p-6">
        <p className="text-lg font-medium mb-4">Basic details</p>
        <hr />
        <div className="mt-2">
          <div className="mb-4 mt-6">
            <p className="mb-1 font-mediumx">Title</p>
            <InputField.Text
              defaultValue={title}
              error={errors.title}
              onChange={setTitle}
              placeholder="Eg. Daily standup"></InputField.Text>
          </div>
          <div className="mb-4">
            <p className="mb-1 font-mediumx">Description</p>
            <InputField.TextArea
              defaultValue={description}
              onChange={setDescription}
              placeholder="Eg. Daily checkin to keep up-to-date with the team's progress"
              className="sm:text-base"></InputField.TextArea>
          </div>
          <div className="mb-0">
            <p className="mb-0 font-mediumx">Participant emails</p>
            <p className="mb-2 text-sm text-gray-500">Separate participant emails by comma</p>
            <InputField.TextArea
              defaultValue={emails}
              error={errors.emails}
              onChange={setEmails}
              placeholder="Eg. ross@easyscrum.co, rachel@easyscrum.co, joey@easyscrum.co, monica@easyscrum.co, chandler@easyscrum.co"
              className="sm:text-base"></InputField.TextArea>
          </div>
        </div>
      </div>
      <div className="p-6 bg-gray-50 flex flex-row-reverse py-3">
        <PrimaryButton disabled={!title || !emails} onClick={saveAndMove}>
          Next step
        </PrimaryButton>
      </div>
    </div>
  );
}
