/** @format */

import React, { Fragment, useState, useRef, useEffect } from "react";
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
  const nameField = useRef();
  const selectRole = useRef();
  const pokerClient = new Poker();
  const templates = [
    { id: 1, name: "Fibonacci series(1,2,3,5,8,13)" },
    { id: 2, name: "1 - 10" },
    { id: 3, name: "T-shirt sizes (XS, S, M, L, XL, 2XL" },
    { id: 0, name: "Custom" },
  ];

  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [name, setName] = useState("");
  const [cardVotes, setCardVotes] = useState("");
  const [isSpectator, setIsSpectator] = useState(false);
  const [state, setState] = useState("init");
  const [error, setError] = useState(false);

  useEffect(() => () => pokerClient.cancel(), []);

  const createBoard = () => {
    setState("creating");
    const payload = {
      name,
      custom_votes: cardVotes,
      template_id: selectedTemplate.id,
      is_spectator: isSpectator,
    };
    pokerClient
      .createBoard({ board: payload })
      .then(({ data }) => {
        if (!data.status) return;
        closeModal();
        props.afterCreate(data);
      })
      .catch((r) =>
        pokerClient.handleError(r, ({ response }) => {
          if (response?.data?.errors?.name) setError(response.data.errors.name);
          else if (response?.data?.error) setError(response.data.error);
        })
      );
  };

  const closeModal = () => {
    props.setOpen(false);
    setName("");
    setState("init");
    setError(false);
  };

  return (
    <Transition.Root show={props.open} as={Fragment}>
      <Dialog
        as="div"
        static
        className="fixed z-40 inset-0 overflow-y-auto"
        initialFocus={nameField}
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
                      New Planning poker board
                    </Dialog.Title>
                    {error && (
                      <div className="w-full rounded border border-red-300 bg-red-100 text-center p-3 mt-3">
                        <p>{error}</p>
                      </div>
                    )}
                    <p className="mb-1 mt-3">Name</p>
                    <input
                      className="w-full bg-white border border-gray-400 w-full rounded p-3 outline-none"
                      placeholder="Eg. What went well?"
                      value={name}
                      ref={nameField}
                      onChange={(event) => setName(event.target.value)}
                    />
                    <div className="mt-5 z-30 relative">
                      <Listbox value={selectedTemplate} onChange={setSelectedTemplate}>
                        {(payload) => (
                          <>
                            <Listbox.Label className="block">Choose a template</Listbox.Label>
                            <div className="mt-1 relative w-full">
                              <Listbox.Button
                                useref={selectRole}
                                className="relative w-full bg-white border border-gray-400 rounded-md shadow-sm pl-3 pr-10 py-3 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm">
                                <span className="flex items-center">
                                  <span className="block truncate">{selectedTemplate.name}</span>
                                </span>
                                <span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                  <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </span>
                              </Listbox.Button>

                              <Transition
                                show={payload.open}
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0">
                                <Listbox.Options
                                  static
                                  className="absolute mt-1 w-full bg-white shadow-lg max-h-56 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                                  {templates.map((template) => {
                                    return (
                                      <Listbox.Option
                                        key={template.id}
                                        value={template}
                                        className={({ active }) =>
                                          classNames(
                                            active ? "text-white bg-green-600" : "text-gray-900",
                                            "cursor-default select-none relative py-2 pl-3 pr-9"
                                          )
                                        }>
                                        {({ selected, active }) => (
                                          <>
                                            <div className="flex items-center">
                                              <span
                                                className={classNames(
                                                  selected ? "font-semibold" : "font-normal",
                                                  "block truncate"
                                                )}>
                                                {template.name}
                                              </span>
                                            </div>

                                            {selected ? (
                                              <span
                                                className={classNames(
                                                  active ? "text-white" : "text-green-600",
                                                  "absolute inset-y-0 right-0 flex items-center pr-4"
                                                )}>
                                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                              </span>
                                            ) : null}
                                          </>
                                        )}
                                      </Listbox.Option>
                                    );
                                  })}
                                </Listbox.Options>
                              </Transition>
                            </div>
                          </>
                        )}
                      </Listbox>
                    </div>

                    {selectedTemplate.id == 0 && (
                      <>
                        <p className=" mt-2 mb-1">Separate votes by comma</p>
                        <input
                          className="w-full bg-white border border-gray-400 w-full rounded p-3 outline-none"
                          placeholder="Eg. 1,2,3,5,8,13"
                          value={cardVotes}
                          onChange={(event) => setCardVotes(event.target.value)}
                        />
                        <p className="text-sm text-yellow-600 mt-1 ">
                          Note: The order of the votes should be from lower value to higher value
                        </p>
                      </>
                    )}

                    <div className="mt-5 relative">
                      <Toggle
                        labelText="Add me as a spectator"
                        description="Turn this on if you are only facilitating the planning poker and not voting for issues"
                        state={false}
                        toggleFront={true}
                        onChange={setIsSpectator}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-4 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
                <PrimaryButton onClick={createBoard} disabled={name.trim() == "" || state == "creating"}>
                  {state == "creating" ? "Creating..." : "Create"}
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
