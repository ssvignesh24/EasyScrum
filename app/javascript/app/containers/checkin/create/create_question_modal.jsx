/** @format */

import React, { Fragment, useState, useRef, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import PropTypes from "prop-types";
import _ from "lodash";

import SelectBox from "../../../components/select_box";
import Toggle from "../../../components/toggle";
import Question from "../../../components/question";
import { Primary as PrimaryButton, Muted as MutedButton } from "../../../components/button";
import InputField from "../../../components/input_fields";

function CreateQuestion({ open, setOpen, onCreate, question }) {
  const promptField = useRef();
  const currentQuestion = question || {};
  const isEdit = !!currentQuestion.prompt;
  const answerTypes = [
    { key: "text", name: "Text" },
    { key: "number", name: "Number" },
    { key: "datetime", name: "Datetime" },
    { key: "date", name: "Date" },
    { key: "time", name: "Time" },
    { key: "checklist", name: "Checklist" },
    { key: "dropdown", name: "Dropdown" },
    { key: "rating5", name: "Rating (1-5)" },
    { key: "rating10", name: "Rating (1-10)" },
  ];
  const [prompt, setPrompt] = useState("");
  const [description, setDescription] = useState("");
  const [answerType, setAnswerType] = useState(answerTypes[0]);
  const [isMandatory, setIsMandatory] = useState(false);
  const [isCritical, setIsCritical] = useState(false);
  const [options, setOptions] = useState("");

  // TODO: Used for editing question
  // useEffect(() => {
  //   if (Object.keys(currentQuestion).length == 0) {
  //     setPrompt("");
  //     setDescription("");
  //     setIsMandatory(false);
  //     setIsCritical(false);
  //     return;
  //   }
  //   setPrompt(currentQuestion.prompt);
  //   setDescription(currentQuestion.description || "");
  //   setAnswerType(currentQuestion.answerType || answerTypes[0]);
  //   setIsMandatory(currentQuestion.isMandatory || false);
  //   setIsCritical(currentQuestion.isCritical || false);
  //   setOptions("");
  // }, [question]);

  const closeModal = () => {
    setOpen(false);

    setTimeout(() => {
      setPrompt("");
      setDescription("");
      setAnswerType(answerTypes[0]);
      setIsMandatory(false);
      setIsCritical(false);
      setOptions("");
    }, 1000);
  };

  const addQuestion = () => {
    closeModal();
    const question = {
      prompt,
      description,
      answerType,
      isMandatory,
      isCritical,
    };
    question.options = options.split(",").map((op) => op.trim());
    onCreate(question);
  };

  const getDefaultPlaceholder = (answerType) => {
    let placeholder = "Placeholder text";
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

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        static
        className="fixed z-40 inset-0 overflow-y-auto"
        initialFocus={promptField}
        open={open}
        onClose={() => {
          closeModal();
        }}>
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0">
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
              <div className="bg-white">
                <div className="">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left">
                    <div className="w-full flex">
                      <div className="w-6/12 p-6">
                        <Dialog.Title as="h3" className="text-xl leading-6 font-medium text-gray-900">
                          Create question
                        </Dialog.Title>
                        <div className="w-full mt-6">
                          <p className="font-medxum mb-1">Question</p>
                          <InputField.Text
                            className="w-full bg-white border border-gray-400 w-full rounded p-3 outline-none focus:border-green-500"
                            placeholder="Eg. What are you currently working on?"
                            defaultValue={prompt}
                            ref={promptField}
                            onChange={setPrompt}></InputField.Text>

                          <div className="z-30 relative">
                            <p className="mt-5 mb-1">Answer type</p>
                            <SelectBox
                              options={answerTypes}
                              onChange={(value) => {
                                setAnswerType(value);
                              }}
                              selected={answerType}
                            />
                          </div>

                          {answerType.key == "checklist" && (
                            <>
                              <p className="mt-5 mb-1">Checklist option (Separate options by comma)</p>
                              <InputField.Text
                                className="w-full bg-white border border-gray-400 w-full rounded p-3 outline-none focus:border-green-500"
                                type="text"
                                placeholder="Eg. Option 1, Option 2, Option 3"
                                defaultValue={options}
                                onChange={setOptions}></InputField.Text>
                            </>
                          )}

                          {answerType.key == "dropdown" && (
                            <>
                              <p className="mt-5 mb-1">Dropdwon option (Separate options by comma)</p>
                              <InputField.Text
                                className="w-full bg-white border border-gray-400 w-full rounded p-3 outline-none focus:border-green-500"
                                type="text"
                                placeholder="Eg. Option 1, Option 2, Option 3"
                                defaultValue={options}
                                onChange={setOptions}></InputField.Text>
                            </>
                          )}

                          <p className="mt-5 mb-1">Description/hint</p>
                          <InputField.Text
                            className="w-full bg-white border border-gray-400 w-full rounded p-3 outline-none focus:border-green-500"
                            placeholder="Eg. Please write about the ticket that you are currently working on"
                            defaultValue={description}
                            onChange={setDescription}></InputField.Text>

                          <div className="mt-5 z-10 relative">
                            <Toggle
                              labelText={"Mandatory question"}
                              onChange={(value) => {
                                setIsMandatory(value);
                              }}
                              toggleFront={true}
                              description={"The user can submit the response without answering this question"}
                              state={isMandatory}
                            />

                            <div className="w-full">
                              <Toggle
                                labelText={"Critical question"}
                                onChange={(value) => {
                                  setIsCritical(value);
                                }}
                                toggleFront={true}
                                description={
                                  "If any user respondes to this question, the response will be highlighted in the report. For example, to check if the user is currently blocked"
                                }
                                state={isCritical}
                              />
                            </div>
                          </div>
                          <div className="mt-5 flex flex-row-reverse">
                            <PrimaryButton
                              type="button"
                              className="ml-3 btn-primary"
                              onClick={() => addQuestion()}
                              disabled={!prompt.trim()}>
                              {!isEdit && "Add question"}
                              {isEdit && "Update "}
                            </PrimaryButton>
                            <MutedButton type="button" className="btn-simple" onClick={() => closeModal()}>
                              Cancel
                            </MutedButton>
                          </div>
                        </div>
                      </div>
                      <div className="w-6/12 bg-gray-100 p-6">
                        <Dialog.Title as="h3" className="text-xl leading-6 font-medium text-gray-900">
                          Preview
                        </Dialog.Title>
                        {!prompt && <p className="text-gray-500"> Please type in a question to show preview</p>}
                        {prompt && (
                          <div className="w-full mt-4">
                            <div className="bg-white rounded shadow p-6">
                              <Question
                                prompt={prompt}
                                answerType={answerType.key}
                                placeholder={getDefaultPlaceholder(answerType.key)}
                                description={description}
                                options={options}
                                isMandatory={isMandatory}
                                onChange={() => {}}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

CreateQuestion.propTypes = {
  onCreate: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  question: PropTypes.any,
};

export default CreateQuestion;
