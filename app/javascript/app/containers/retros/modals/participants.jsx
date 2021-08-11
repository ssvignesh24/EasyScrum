/** @format */

import React, { Fragment, useState, useRef, useContext, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import PropTypes from "prop-types";

import { Primary as PrimaryButton, Muted as MutedButton } from "../../../components/button";

import DefaultDp from "images/default_dp.jpeg";
import Retro from "../../../services/retro";
import ConfirmDialog from "../../../components/confirmdialog";
import BoardNetwork from "../board";

function ParticipantsModal(props) {
  const closeButton = useRef();
  const retroClient = new Retro(props.board.id);
  const { board } = props;

  const [state, setState] = useState("init");
  const [error, setError] = useState(false);
  const [deleteState, setDeleteState] = useState("init");
  const [showConfirmRemove, setShowConfirmRemove] = useState(false);
  const [currentParticipant, setCurrentParticipant] = useState();

  const closeModal = () => {
    props.setOpen(false);
    setState("init");
    setDeleteState("init");
    setCurrentParticipant(false);
    setError(false);
  };

  useEffect(() => () => retroClient.cancel(), []);

  const showDeleteConfirmation = (participant) => {
    if (!board.canManageBoard || participant.id == board.currentParticipantId) return;
    setCurrentParticipant(participant);
    props.setOpen(false);
    setShowConfirmRemove(true);
  };

  const removeParticipant = () => {
    if (!currentParticipant?.id) return;
    setDeleteState("deleting");
    retroClient
      .removeParticipant(currentParticipant.id)
      .then(({ data }) => {
        if (!data.status) return;
        setDeleteState("init");
        setShowConfirmRemove(false);
        props.setOpen(true);
        props.afterRemove(data.participant.id);
      })
      .catch((r) => retroClient.handleError(r));
  };

  return (
    <>
      {board.canManageBoard && (
        <ConfirmDialog
          open={showConfirmRemove}
          title={`Remove ${currentParticipant?.name || "participant"}?`}
          body="The user may no longer able to create and comment on cards. Are you sure want to proceed?"
          okText={deleteState == "init" ? "Yes, Remove" : "Removing from board..."}
          disabled={deleteState == "deleting"}
          onCancel={() => {
            setDeleteState("init");
            setShowConfirmRemove(false);
            props.setOpen(true);
          }}
          cancelText="Cancel"
          onOk={removeParticipant}
        />
      )}
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
                <div className="bg-white pt-5 pb-4 sm:pb-4 rounded-t-lg">
                  <div className="">
                    <div className="mt-3 text-center sm:mt-0 sm:text-left">
                      <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900 pt-2 pb-4 px-6">
                        Participants
                      </Dialog.Title>

                      <div
                        className="w-full h-full overflow-x-hidden"
                        style={{ maxHeight: "400px", overflowY: "auto" }}>
                        {error && (
                          <div className="w-full rounded border border-red-300 bg-red-100 text-center p-3 mt-3">
                            <p>{error}</p>
                          </div>
                        )}
                        {board.participants.length > 0 &&
                          board.participants.map((participant) => {
                            return (
                              <div
                                onClick={() => showDeleteConfirmation(participant)}
                                className="flex py-3 px-6 hover:bg-green-500 hover:bg-opacity-10 cursor-pointer"
                                key={participant.id}>
                                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                                  <img src={DefaultDp} className="w-full min-h-full" />
                                </div>
                                <div className="w-full pl-2">
                                  <p className="font-medium">{participant.name}</p>
                                  <p className="text-gray-500 text-sm">{participant.email}</p>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-4 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
                  <MutedButton ref={closeButton} className="mr-3" onClick={() => closeModal()}>
                    Close
                  </MutedButton>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}

ParticipantsModal.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  board: PropTypes.object.isRequired,
  afterRemove: PropTypes.func.isRequired,
};

export default ParticipantsModal;
