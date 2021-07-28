/** @format */

import React, { Fragment, useState, useRef, useContext } from "react";
import { Dialog, Transition } from "@headlessui/react";
import PropTypes from "prop-types";
import { Listbox } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";

import Toggle from "../../../components/toggle";
import Poker from "../../../services/poker";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

import { Primary as PrimaryButton, Muted as MutedButton } from "../../../components/button";

function CreateColumn(props) {
  const summaryField = useRef();
  const pokerClient = new Poker(props.board.id);

  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [state, setState] = useState("init");
  const [error, setError] = useState(false);

  const createIssue = () => {
    setState("adding");
    const payload = {
      summary,
      description,
      link,
    };
    pokerClient
      .createIssue({ issue: payload })
      .then(({ data }) => {
        console.log(data);
        if (!data.status) return;
        props.afterCreate(data.issue);
        closeModal();
      })
      .catch((r) =>
        pokerClient.handleError(r, ({ response }) => {
          if (response?.data?.errors?.summary) setError(response.data.errors.summary);
          else if (response?.data?.error) setError(response.data.error);
        })
      );
  };

  const closeModal = () => {
    props.setOpen(false);
    setSummary("");
    setDescription("");
    setLink("");
    setState("init");
    setError(false);
  };

  return (
    <Transition.Root show={props.open} as={Fragment}>
      <Dialog
        as="div"
        static
        className="fixed z-40 inset-0 overflow-y-auto"
        initialFocus={summaryField}
        open={props.open}
        onClose={props.setOpen}>
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
            <div className="inline-block align-bottom bg-white rounded-lg text-left shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 rounded-t-lg">
                <div className="">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left">
                    <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                      Add an issue
                    </Dialog.Title>
                    {error && (
                      <div className="w-full rounded border border-red-300 bg-red-100 text-center p-3 mt-3">
                        <p>{error}</p>
                      </div>
                    )}
                    <p className="mb-1 mt-3">Summary</p>
                    <input
                      className="w-full bg-white border border-gray-400 w-full rounded p-3 outline-none"
                      placeholder="Eg. Upgrade angular"
                      value={summary}
                      ref={summaryField}
                      onChange={(event) => setSummary(event.target.value)}
                    />
                    <p className="mb-1 mt-3">Description</p>
                    <textarea
                      className="w-full bg-white border border-gray-400 w-full rounded p-3 outline-none"
                      placeholder="Eg. Upgrade angular to latest version."
                      value={description}
                      onChange={(event) => setDescription(event.target.value)}></textarea>
                    <p className="mb-1 mt-1">Link</p>
                    <input
                      className="w-full bg-white border border-gray-400 w-full rounded p-3 outline-none"
                      placeholder="Eg. https://demo.atlassian.com/demo/DEMO-123"
                      value={link}
                      onChange={(event) => setLink(event.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-4 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
                <PrimaryButton onClick={createIssue} disabled={summary.trim() == "" || state == "adding"}>
                  {state == "adding" ? "Adding..." : "Add"}
                </PrimaryButton>
                <MutedButton className="mr-3" onClick={() => closeModal()}>
                  Cancel
                </MutedButton>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

CreateColumn.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  afterCreate: PropTypes.func,
};

export default CreateColumn;