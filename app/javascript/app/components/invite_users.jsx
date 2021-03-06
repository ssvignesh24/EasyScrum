/** @format */

import React, { Fragment, useState, useRef, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import PropTypes from "prop-types";
import Tracking from "../services/tracking";

import { Muted as MutedButton, Primary as PrimaryButton } from "./button";
import { CheckIcon, ClipboardCopyIcon } from "@heroicons/react/solid";

function InviteUsers(props) {
  const closeButton = useRef();
  const linkField = useRef();
  let copyTimer = null;

  const [copyState, setCopyState] = useState("init");
  const [error, setError] = useState(false);

  useEffect(() => {
    return () => {
      if (copyTimer) clearTimeout(copyTimer);
    };
  }, []);

  const closeModal = () => {
    props.setOpen(false);
    setError(false);
  };

  const copyLink = () => {
    Tracking.logEvent("Copy invite link");
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(props.board.inviteURL);
      setCopyState("copied");
    } else {
      linkField.current.select();
      document.execCommand("copy");
      setCopyState("copied");
    }
    copyTimer = setTimeout(() => setCopyState("init"), 5000);
  };

  return (
    <Transition.Root show={props.open} as={Fragment}>
      <Dialog
        as="div"
        static
        className="fixed z-40 inset-0 overflow-y-auto"
        initialFocus={closeButton}
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
                      Invite users
                    </Dialog.Title>
                    {error && (
                      <div className="w-full rounded border border-red-300 bg-red-100 text-center p-3 mt-3">
                        <p>{error}</p>
                      </div>
                    )}
                    <p className="my-2 text-gray-600">
                      Share the below link with the users you would like to add. Participants should provide their name
                      and email before adding themselves to the board
                    </p>
                    <p className="mb-1 mt-3">Invite link</p>
                    <div className="w-full flex">
                      <input
                        className="bg-gray-100 border border-gray-400 w-full rounded p-3 outline-none mr-2"
                        disabled={true}
                        ref={linkField}
                        value={props.board.inviteURL}
                      />
                      <PrimaryButton title="Copy link" onClick={copyLink}>
                        {copyState == "init" && <ClipboardCopyIcon className="w-5 h-5 text-white"></ClipboardCopyIcon>}
                        {copyState == "copied" && <CheckIcon className="w-5 h-5 text-white"></CheckIcon>}
                      </PrimaryButton>
                    </div>
                    {/* <p className="mb-1 mt-3">Emails</p>
                    <textarea
                      className="w-full bg-white border border-gray-400 w-full rounded p-3 outline-none"
                      placeholder="Eg. smith@candidteams.com, sophie@candidteams.com"
                      value={name}
                      ref={nameField}
                      onChange={(event) => setName(event.target.value)}></textarea> */}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-4 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
                <MutedButton className="" onClick={() => closeModal()} ref={closeButton}>
                  Close
                </MutedButton>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

InviteUsers.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  afterInvite: PropTypes.func,
  board: PropTypes.object.isRequired,
};

export default InviteUsers;
