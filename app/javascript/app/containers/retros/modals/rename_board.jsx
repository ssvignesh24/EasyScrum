/** @format */

import React, { Fragment, useState, useRef, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import PropTypes from "prop-types";

import { Primary as PrimaryButton, Muted as MutedButton } from "../../../components/button";

import Retro from "../../../services/retro";
import InputFields from "../../../components/input_fields";

function RenameBoard(props) {
  const nameField = useRef();
  const retroClient = new Retro(props.board.id);

  const [name, setName] = useState(props.board.name);
  const [state, setState] = useState("init");
  const [error, setError] = useState(false);
  const [nameError, setNameError] = useState();

  const closeModal = () => {
    props.setOpen(false);
    setState("init");
    setError("");
    setNameError("");
  };

  useEffect(() => () => retroClient.cancel(), []);

  const rename = () => {
    setError(false);
    setState("renaming");
    retroClient
      .renameBoard(name)
      .then(({ data }) => {
        if (!data.status) return;
        props.afterRename(data.board.name);
        mixpanel?.track("Retro: Rename board", { boardId: data.board.id });
        setName(data.board.name);
        closeModal();
      })
      .catch((r) =>
        retroClient.handleError(r, ({ response }) => {
          setName(props.board.name);
          setState("init");
          if (response.data?.error) setError(response.data.error);
          else if (response.data?.errors?.name) setNameError(response.data?.errors?.name);
        })
      );
  };

  return (
    <Transition.Root show={props.open} as={Fragment}>
      <Dialog
        as="div"
        static
        className="fixed z-40 inset-0 overflow-y-auto"
        initialFocus={nameField}
        open={props.open}
        onClose={() => {
          setName(props.board.name);
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
            <div className="inline-block align-bottom bg-white rounded-lg text-left shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 rounded-t-lg">
                <div className="">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left">
                    <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                      Rename retrospective board
                    </Dialog.Title>
                    {error && (
                      <div className="w-full rounded border border-red-300 bg-red-100 text-center p-3 mt-3">
                        <p>{error}</p>
                      </div>
                    )}
                    <p className="mb-1 mt-3">Name</p>
                    <InputFields.Text
                      className="w-full bg-white border border-gray-400 w-full rounded p-3 outline-none"
                      placeholder="Eg. What went well?"
                      defaultValue={name}
                      value={name}
                      ref={nameField}
                      error={nameError}
                      onChange={setName}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-4 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
                <PrimaryButton onClick={rename} disabled={name.trim() == "" || state == "renaming"}>
                  {state == "renaming" ? "Renaming..." : "Rename"}
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

RenameBoard.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  board: PropTypes.object.isRequired,
  afterRename: PropTypes.func.isRequired,
};

export default RenameBoard;
