/** @format */

import React, { useState, Fragment, useEffect } from "react";
import ReactDOM from "react-dom";
import pluralize from "pluralize";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { Menu, Transition } from "@headlessui/react";

import { Link } from "@reach/router";
import { Primary as PrimaryButton } from "../../components/button";
import ConfirmDialog from "../../components/confirmdialog";
import to_sentence from "../../lib/to_sentence";
import CheckinClient from "../../services/checkin";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ({ checkin, onPause, afterDelete }) {
  const checkinClient = new CheckinClient();

  const [checkinState, setCheckinState] = useState("init");
  const [showConfirmPause, setShowConfirmPause] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [pauseText, setPauseText] = useState("");

  useEffect(() => {
    if (!checkin) return;
    setPauseText(checkin.paused ? "Yes, unpause" : "Yes, pause");
  });

  const togglePause = () => {
    setPauseText(checkin.paused ? "Unpausing..." : "Pausing...");
    setCheckinState("pausing");
    checkinClient
      .togglePause(checkin.id)
      .then(({ data }) => {
        if (!data.status) return;
        setShowConfirmPause(false);
        setCheckinState("init");
        setPauseText(data.checkin.paused ? "Yes, unpause" : "Yes, pause");
        onPause(data.checkin.paused);
      })
      .catch((r) => checkinClient.handleError(r));
  };

  const deleteCheckin = () => {
    setCheckinState("deleting");
    checkinClient
      .destroy(checkin.id)
      .then(({ data }) => {
        if (!data.status) return;
        setShowConfirmDelete(false);
        setCheckinState("deleted");
        afterDelete();
      })
      .catch((r) => checkinClient.handleError(r));
  };

  return (
    <div className="w-full bg-white shadow border-b border-gray-300 z-30 relative flex " style={{ height: "80px" }}>
      {!checkin && (
        <div className="w-full h-full px-4 py-6">
          <div className="w-6/12 h-full animate-pulse flex-col items-center">
            <div className="w-72 mb-3 h-3 rounded-lg bg-gray-200"></div>
            <div className="w-48 h-2 rounded bg-gray-200"></div>
          </div>
          <div className="w-6/12"></div>
        </div>
      )}
      {checkin && (
        <>
          {checkin && checkin.canManage && (
            <>
              <ConfirmDialog
                open={showConfirmPause}
                title={checkin.paused ? "Unpause checkin?" : "Pause checkin?"}
                body={
                  checkin.paused
                    ? "This action will resumce sending this checkin to the participants. Are you want to proceed?"
                    : "This is will stop sending this checkin to the participants until you unpause. Do you want to procee?"
                }
                okText={pauseText}
                disabled={checkinState == "pausing"}
                onCancel={() => {
                  setShowConfirmPause(false);
                }}
                okButton={PrimaryButton}
                cancelText="Cancel"
                onOk={togglePause}
              />
              <ConfirmDialog
                open={showConfirmDelete}
                title="Delete checkin?"
                body="This is will also delete all the responses in this checkin. Are you want to delete the checkin?"
                okText={checkinState == "init" ? "Yes, Delete" : "Deleting checkin..."}
                disabled={checkinState == "deleting" || checkinState == "deleted"}
                onCancel={() => {
                  setShowConfirmDelete(false);
                }}
                cancelText="Cancel"
                onOk={deleteCheckin}
              />
            </>
          )}

          <div className="w-6/12 h-full flex-col px-4 py-4">
            <p className="font-medium">{checkin.title}</p>
            <div className="w-full flex text-sm text-gray-500 items-center">
              {checkin.paused && (
                <>
                  <div className="text-red-500">Paused</div>
                  <div className="mx-2 w-1 h-1 rounded-full bg-gray-500"> </div>
                </>
              )}
              <div>{pluralize("Participant", checkin.participantCount, true)}</div>
              <div className="mx-2 w-1 h-1 rounded-full bg-gray-500"> </div>
              <div>
                Every {to_sentence(checkin.days)} at {checkin.time}
              </div>
            </div>
          </div>
          <div className="w-6/12 flex flex-row-reverse">
            <div className="flex items-center">
              {checkin.canManage && (
                <Menu as="div" className="relative z-30">
                  {({ open }) => (
                    <>
                      <Menu.Button className="mr-3">
                        <PrimaryButton as="div">
                          Checkin options
                          <ChevronDownIcon className="w-5 h-5 text-white"></ChevronDownIcon>
                        </PrimaryButton>
                      </Menu.Button>

                      <Transition
                        show={open}
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95">
                        <Menu.Items
                          static
                          className="origin-top-right absolute right-0 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <div className="py-1">
                            <Menu.Item>
                              {({ active }) => (
                                <Link to={`/checkin/${checkin.id}/edit`}>
                                  <button
                                    className={classNames(
                                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                                      "block w-full text-left px-4 py-2 text-sm"
                                    )}>
                                    Edit
                                  </button>
                                </Link>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  onClick={() => {
                                    setShowConfirmPause(true);
                                  }}
                                  className={classNames(
                                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                                    "block w-full text-left px-4 py-2 text-sm"
                                  )}>
                                  {checkin.paused ? "Unpause" : "Pause"}
                                </button>
                              )}
                            </Menu.Item>

                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  onClick={() => setShowConfirmDelete(true)}
                                  className={classNames(
                                    active ? "bg-red-100 text-gray-900" : "text-gray-700",
                                    "block w-full text-left px-4 py-2 text-sm"
                                  )}>
                                  Delete
                                </button>
                              )}
                            </Menu.Item>
                          </div>
                        </Menu.Items>
                      </Transition>
                    </>
                  )}
                </Menu>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
