/**
 * /* This example requires Tailwind CSS v2.0+
 *
 * @format
 */
import React, { Fragment, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import Scrollbars from "react-custom-scrollbars";

import InputField from "../input_fields";
import ConfirmDialog from "../confirmdialog";
import { Primary as PrimaryButton } from "../button";
import { CheckCircleIcon } from "@heroicons/react/solid";
import Retro from "../../services/retro";
import NoDataImg from "images/nodata.png";

export default function Example({
  open,
  setOpen,
  board,
  currentActionItems,
  previousActionItems,
  afterCreate,
  afterUpdate,
  afterDelete,
  previousRetroName,
}) {
  const retroClient = new Retro(board.id);
  const newActionItemField = useRef();

  const [activeList, setActiveList] = useState("current");
  const [state, setState] = useState("init");
  const [newActionItem, setNewActionItem] = useState();

  useEffect(() => () => retroClient.cancel(), []);

  const addActionItem = () => {
    if (!newActionItem) return;
    setState("creating");
    retroClient
      .createActionItem(newActionItem)
      .then(({ data }) => {
        if (!data.status) return;
        setState("ready");
        afterCreate(data.actionItem);
        setNewActionItem("");
      })
      .catch((r) => retroClient.handleError(r));
  };

  const toggleComplete = (item) => {
    if (item.status == "deleting") return;
    afterUpdate({ ...item, status: "completing", originalState: item.status });
    retroClient
      .toggleComplete(item.id)
      .then(({ data }) => {
        if (!data.status) return;
        afterUpdate(data.actionItem);
      })
      .catch((r) => retroClient.handleError(r));
  };

  const deleteItem = (item) => {
    if (confirm("Delete action item?")) {
      afterUpdate({ ...item, status: "deleting" });
      retroClient.deleteActionItem(item.id).then(({ data }) => {
        if (!data.status) return;
        afterDelete(data.actionItem);
      });
    }
  };

  return (
    <>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" static className="fixed inset-0 overflow-hidden z-40" open={open} onClose={setOpen}>
          <div className="absolute inset-0 overflow-hidden">
            <Transition.Child
              as={Fragment}
              enter="ease-in-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in-out duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0">
              <Dialog.Overlay className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>
            <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300 sm:duration-500"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300 sm:duration-500"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full">
                <div className="relative w-screen max-w-lg">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0">
                    <div className="absolute top-0 left-0 -ml-8 pt-4 pr-2 flex sm:-ml-10 sm:pr-4">
                      <button
                        className="rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                        onClick={() => setOpen(false)}>
                        <span className="sr-only">Close panel</span>
                        <XIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="h-full flex flex-col pt-6 bg-white shadow-xl overflow-y-scroll">
                    <div className="px-4 sm:px-6">
                      <Dialog.Title className="text-lg font-medium text-gray-900">Action items</Dialog.Title>
                    </div>
                    <div className="w-full border-b border-gray-300 px-6 flex mt-3">
                      <div
                        onClick={() => setActiveList("current")}
                        className={
                          "py-3 border-b-2 mr-4 cursor-pointer " +
                          (activeList == "current"
                            ? "border-green-500 text-green-500"
                            : "hover:border-green-500 border-transparent text-gray-500")
                        }>
                        Current action items
                      </div>
                      <div
                        onClick={() => setActiveList("previous")}
                        className={
                          "py-3 border-b-2 hover:border-green-500 cursor-pointer " +
                          (activeList == "previous"
                            ? "border-green-500 text-green-500"
                            : "hover:border-green-500 border-transparent text-gray-500")
                        }>
                        Previous retro action items
                      </div>
                    </div>
                    <div className="relative flex-1 ">
                      {activeList == "current" && (
                        <>
                          <div
                            className="w-full border-b border-gray-300"
                            style={{ height: board.canManageBoard ? "75%" : "100%" }}>
                            <Scrollbars>
                              {currentActionItems && currentActionItems.length == 0 && (
                                <>
                                  <div className="w-full h-full flex flex-col items-center justify-center">
                                    <img src={NoDataImg} className="w-3/12" />
                                    <div className="mt-5">
                                      <span className="text-gray-500">No actions items</span>
                                      {board.canManageBoard && (
                                        <>
                                          <span className="text-gray-500">, </span>
                                          <span
                                            className="text-green-500 hover:underline cursor-pointer"
                                            onClick={() => newActionItemField.current.focus()}>
                                            create one now.
                                          </span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </>
                              )}
                              {currentActionItems &&
                                currentActionItems.length > 0 &&
                                currentActionItems.map((item) => {
                                  return (
                                    <div
                                      key={item.id}
                                      className={
                                        "w-full py-4 border-b border-gray-200 px-4 sm:px-6 hover:bg-green-50 transition-colors " +
                                        (item.status == "deleting" && "opacity-50")
                                      }>
                                      <p className={item.status == "completed" ? "line-through" : ""}>
                                        {item.actionMessage}
                                      </p>
                                      {board.canManageBoard && (
                                        <div className="w-full flex">
                                          <div className="w-6/12">
                                            {item.status == "pending" && (
                                              <button
                                                className="mt-3 mr-3 text-sm text-green-500 hover:underline"
                                                onClick={() => toggleComplete(item)}>
                                                Mark as complete
                                              </button>
                                            )}
                                            {item.status == "completing" && (
                                              <button className="mt-3 mr-3 text-sm text-green-500 opacity-50">
                                                Marking as complete...
                                              </button>
                                            )}
                                            {item.status == "completed" && (
                                              <button
                                                className="-mt-0.5 mr-3 text-sm text-green-500 item-center"
                                                onClick={() => toggleComplete(item)}>
                                                <div className="inline-block align-middle">
                                                  <CheckCircleIcon className="w-5 h-5 text-green-500"></CheckCircleIcon>
                                                </div>
                                                <div className="inline-block align-middle hover:underline">
                                                  Completed
                                                </div>
                                              </button>
                                            )}
                                            <button
                                              className="mt-3 text-sm text-red-500 hover:underline"
                                              onClick={() => deleteItem(item)}>
                                              {item.status == "deleting" ? "Deleting item..." : "Delete item"}
                                            </button>
                                          </div>
                                          <div className="w-6/12 flex flex-row-reverse"></div>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                            </Scrollbars>
                          </div>
                          {board.canManageBoard && (
                            <div className="w-full h-1/6 px-4 sm:px-6 py-6 bg-gray-50" style={{ height: "25%" }}>
                              <div className="w-full h-4/6">
                                <InputField.TextArea
                                  className="h-full"
                                  onChange={setNewActionItem}
                                  ref={newActionItemField}
                                  listenToChange={newActionItem}
                                />
                              </div>
                              <div className="w-full h-2/6 flex flex-row-reverse mt-3">
                                <div>
                                  <PrimaryButton
                                    disabled={!newActionItem || state == "creating"}
                                    onClick={addActionItem}>
                                    {state == "creating" ? "Creating action item..." : "Add action item"}
                                  </PrimaryButton>
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      )}

                      {activeList == "previous" && (
                        <>
                          <div className="w-full border-b border-gray-300 h-full">
                            <Scrollbars>
                              {previousActionItems && previousActionItems.length == 0 && (
                                <>
                                  <div className="w-full h-full flex flex-col items-center justify-center">
                                    <img src={NoDataImg} className="w-3/12" />
                                    {previousRetroName && (
                                      <p className="text-gray-500 mt-5">No actions items in {previousRetroName}</p>
                                    )}
                                    {!previousRetroName && (
                                      <p className="text-gray-500 mt-5">Looks like this is your first retrospective</p>
                                    )}
                                  </div>
                                </>
                              )}
                              {previousActionItems &&
                                previousActionItems.length > 0 &&
                                previousActionItems.map((item) => {
                                  return (
                                    <div
                                      key={item.id}
                                      className={
                                        "w-full py-4 border-b border-gray-200 px-4 sm:px-6 hover:bg-green-50 transition-colors " +
                                        (item.status == "completed" ? "line-through" : "")
                                      }>
                                      <p className={item.status == "completed" ? "line-through" : ""}>
                                        {item.actionMessage}
                                      </p>
                                    </div>
                                  );
                                })}
                            </Scrollbars>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
