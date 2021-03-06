/** @format */

import React, { Fragment, useState, useRef, useContext, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import PropTypes from "prop-types";

import VoteResults from "../../../components/poker/vote_results";
import Poker from "../../../services/poker";
import Tracking from "../../../services/tracking";

import { Primary as PrimaryButton, Muted as MutedButton } from "../../../components/button";

function AssignPointsModal(props) {
  const pointField = useRef();
  const pokerClient = new Poker(props.board.id);

  const [points, setPoints] = useState("");
  const [state, setState] = useState("init");
  const [error, setError] = useState(false);

  useEffect(() => () => pokerClient.cancel(), []);

  const assignPoint = () => {
    setState("assigning");
    pokerClient
      .assignPoint(props.issue.id, points)
      .then(({ data }) => {
        if (!data.status) return;
        props.afterUpdate(data.issue);
        Tracking.logEvent("Poker: Assign Story points", { boardId: props.board.id, issueId: data.issue.id });
        closeModal();
      })
      .catch((r) =>
        pokerClient.handleError(r, ({ response }) => {
          if (response?.data?.errors?.points) setError(response.data.errors.points);
          else if (response?.data?.error) setError(response.data.error);
          setState("init");
        })
      );
  };

  const closeModal = () => {
    props.setOpen(false);
    setState("init");
    setPoints("");
    setError(false);
  };

  return (
    <Transition.Root show={props.open} as={Fragment}>
      <Dialog
        as="div"
        static
        className="fixed z-40 inset-0 overflow-y-auto"
        initialFocus={pointField}
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
                      Voting results
                    </Dialog.Title>

                    <div className="mt-4 w-full">
                      <VoteResults votes={props.issue.votes.participant_votes} board={props.board}></VoteResults>
                    </div>
                    {!props.issue.isGhost && (
                      <>
                        <hr />

                        <p className="mb-1.5 mt-3 font-medium">Assign a point</p>
                        {error && (
                          <div className="w-full rounded border border-red-300 bg-red-100 text-center p-3 my-3">
                            <p>{error}</p>
                          </div>
                        )}
                        <input
                          className="w-full bg-white border border-gray-400 w-full rounded p-3 outline-none"
                          placeholder="Eg. 5"
                          value={points}
                          ref={pointField}
                          onChange={(event) => setPoints(event.target.value)}
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-4 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
                {!props.issue.isGhost && (
                  <PrimaryButton onClick={assignPoint} disabled={points.trim() == "" || state == "assigning"}>
                    {state == "assigning" ? "Assinging..." : "Assign"}
                  </PrimaryButton>
                )}

                <MutedButton className={!props.issue.isGhost ? "mr-3" : ""} onClick={() => closeModal()}>
                  {props.issue.isGhost ? "Close" : "Cancel"}
                </MutedButton>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

AssignPointsModal.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  afterUpdate: PropTypes.func,
};

export default AssignPointsModal;
