/** @format */

import React, { Fragment, useState, useRef, useContext, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import PropTypes from "prop-types";

import { Primary as PrimaryButton, Muted as MutedButton } from "../../components/button";

import Retro from "../../services/retro";

function CreateColumn(props) {
  const { column } = props;
  const nameField = useRef();
  const retroClient = new Retro(props.boardId);

  const [name, setName] = useState(column.name);
  const [state, setState] = useState("init");
  const [error, setError] = useState(false);

  const closeModal = () => {
    props.setOpen(false);
    setName(column.name);
    setState("init");
    setError(false);
  };

  useEffect(() => () => retroClient.cancel(), []);

  const updateColumn = () => {
    setError(false);
    setState("updating");
    const payload = {
      name,
    };
    retroClient
      .updateColumn(column.id, payload)
      .then(({ data }) => {
        if (!data.status) return;
        closeModal();
        mixpanel?.track("Retro: Update column", { boardId: props.boardId, columnId: data.column.id });
        props.afterUpdate(data.column);
      })
      .catch((r) =>
        retroClient.handleError(r, ({ response }) => {
          if (response?.data?.errors?.name) setError(response.data.errors.name);
          else if (response?.data?.error) setError(response.data.error);
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
                      Edit column
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
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-4 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
                <PrimaryButton onClick={updateColumn} disabled={name.trim() == "" || state == "updating"}>
                  {state == "updating" ? "Updating..." : "Update"}
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
  column: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  afterUpdate: PropTypes.func,
  boardId: PropTypes.any.isRequired,
};

export default CreateColumn;
