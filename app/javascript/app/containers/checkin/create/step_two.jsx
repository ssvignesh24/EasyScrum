/** @format */

import React, { Fragment, useContext, useState } from "react";
import ReactDOM from "react-dom";
import { Primary as PrimaryButton, PrimaryLight, Muted as MutedButton } from "../../../components/button";
import ConfirmDialog from "../../../components/confirmdialog";
import QuestionInfo from "../../../components/question_info";
import CreateQuestionModal from "./create_question_modal";

export default function ({ dispatch, checkin, nextStep, prevStep }) {
  let questionIdCounter = 1;
  const [showCreateQuestion, setShowCreateQuestion] = useState(false);
  const [confirmQuestionDeletion, setConfirmQuestionDeletion] = useState(false);
  const [currentQuestionId, setCurrentQuestionId] = useState(false);
  const [questions, setQuestions] = useState(checkin.questions || []);

  const saveAndMove = () => {
    dispatch({ type: "step_two", questions });
    nextStep();
  };

  const confirmDeletion = (q) => {
    setCurrentQuestionId(q.id_);
    setConfirmQuestionDeletion(true);
  };

  const createQuestion = (q) => {
    q.id_ = questionIdCounter++;
    setQuestions((questions_) => questions_.concat(q));
  };

  const removeQuestion = () => {
    if (!currentQuestionId) return;
    setQuestions((questions_) => questions_.filter((q) => q.id_ != currentQuestionId));
    setConfirmQuestionDeletion(false);
    setCurrentQuestionId(false);
  };

  return (
    <div className="w-full bg-white rounded shadow overflow-hidden">
      <CreateQuestionModal
        open={showCreateQuestion}
        setOpen={setShowCreateQuestion}
        onCreate={createQuestion}></CreateQuestionModal>

      <ConfirmDialog
        open={confirmQuestionDeletion}
        title="Remove question?"
        body="Removing this issue will remove all its votes too and you can't undo the action. Are you sure want to remove this issue?"
        okText="Yes, remove"
        onCancel={() => {
          setConfirmQuestionDeletion(false);
          setCurrentQuestionId(false);
        }}
        cancelText="Cancel"
        onOk={removeQuestion}
      />
      <div className="p-6">
        <p className="text-lg font-medium mb-4">Questions</p>
        <hr />
        <div className="mt-6">
          {questions.length > 0 &&
            questions.map((q, index) => {
              return (
                <Fragment key={index}>
                  <QuestionInfo question={q} confirmDeletion={() => confirmDeletion(q)}></QuestionInfo>
                </Fragment>
              );
            })}
          <PrimaryButton onClick={() => setShowCreateQuestion(true)} className="w-full">
            Add a question
          </PrimaryButton>
        </div>
      </div>
      <div className="p-6 bg-gray-50 flex flex-row-reverse py-3">
        <PrimaryButton disabled={questions.length == 0} onClick={saveAndMove}>
          Next step
        </PrimaryButton>
        <MutedButton className="mr-2" onClick={prevStep}>
          Previous step
        </MutedButton>
      </div>
    </div>
  );
}
