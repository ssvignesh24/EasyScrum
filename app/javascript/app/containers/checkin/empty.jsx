/** @format */

import React, { Fragment, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import CurrentResourceContext from "../../contexts/current_resource";
import pluralize from "pluralize";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { Menu, Transition } from "@headlessui/react";

import to_sentence from "../../lib/to_sentence";
import NoDataImg from "images/nodata.png";
import CheckinClient from "../../services/checkin";
import { Primary as PrimaryButton } from "../../components/button";
import { Redirect } from "@reach/router";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ({ checkinId }) {
  const checkinClient = new CheckinClient();

  const [state, setState] = useState("loading");
  const [checkin, setCheckin] = useState();

  useEffect(() => {
    checkinClient
      .show(checkinId)
      .then(({ data }) => {
        if (!data.status) {
          setState("error");
          return;
        }
        setCheckin(data.checkin);
        if (data.checkin.issues.length == 0) setState("empty");
        else setState("loaded");
      })
      .catch((r) => checkinClient.handleError(r, () => setState("error")));
    return () => checkinClient.cancel();
  }, []);

  return (
    <div className="w-full" style={{ height: "calc(100vh - 60px" }}>
      <div className="w-full bg-white shadow border-b border-gray-300 z-30 relative flex " style={{ height: "80px" }}>
        {state == "loading" && (
          <div className="w-full h-full px-4 py-6">
            <div className="w-6/12 h-full animate-pulse flex-col items-center">
              <div className="w-72 mb-3 h-3 rounded-lg bg-gray-200"></div>
              <div className="w-48 h-2 rounded bg-gray-200"></div>
            </div>
            <div className="w-6/12"></div>
          </div>
        )}
        {state == "empty" && (
          <>
            <div className="w-6/12 h-full flex-col px-4 py-4">
              <p className="font-medium">{checkin.title}</p>
              <div className="w-full flex text-sm text-gray-500 items-center">
                <div>{pluralize("Participant", checkin.participantCount, true)}</div>
                <div className="mx-2 w-1 h-1 rounded-full bg-gray-500"> </div>
                <div>
                  Every {to_sentence(checkin.days)} at {checkin.time}
                </div>
              </div>
            </div>
            <div className="w-6/12 flex flex-row-reverse">
              <div className="flex items-center">
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
                                <button
                                  className={classNames(
                                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                                    "block w-full text-left px-4 py-2 text-sm"
                                  )}>
                                  Edit
                                </button>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  className={classNames(
                                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                                    "block w-full text-left px-4 py-2 text-sm"
                                  )}>
                                  Pause
                                </button>
                              )}
                            </Menu.Item>

                            <Menu.Item>
                              {({ active }) => (
                                <button
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
              </div>
            </div>
          </>
        )}
      </div>
      {state == "error" && (
        <div className="w-full flex z-28 relative" style={{ height: "calc(100% - 80px)" }}>
          <p>Error loading</p>
        </div>
      )}
      {state == "empty" && (
        <div className="w-full flex z-28 relative items-center justify-center" style={{ height: "calc(100% - 80px)" }}>
          <div className="container mx-auto">
            <div className="mx-auto">
              <img src={NoDataImg} className="w-full mx-auto" style={{ width: "180px" }} />
            </div>
            <p className="text-lg text-gray-700 mt-5 text-center">
              This checkin has not started yet. Please comeback later
            </p>
          </div>
        </div>
      )}
      {state == "loaded" && <Redirect to={`/checkin/${checkin.id}/issue/${checkin.lastIssueId}`} noThrow />}
    </div>
  );
}
