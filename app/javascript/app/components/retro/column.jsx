/** @format */

import React, { Fragment, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { DotsVerticalIcon } from "@heroicons/react/solid";
import { Menu, Transition } from "@headlessui/react";
import { Scrollbars } from "react-custom-scrollbars";
import pluralize from "pluralize";

import CreateCard from "./create_card";
import EditColumnModal from "./edit_column";
import ConfirmDialog from "../confirmdialog";

import Retro from "../../services/retro";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ({ children, boardId, column, afterUpdate, afterDelete, addCard, canManage }) {
  const retroClient = new Retro(boardId);

  const [showEditColumn, setShowEditColumn] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [state, setState] = useState("ready");

  useEffect(() => () => retroClient.cancel(), []);

  const deleteColumn = () => {
    setState("deleting");
    retroClient
      .deleteColumn(column.id)
      .then(({ data }) => {
        if (!data.status) return;
        afterDelete(column);
        mixpanel?.track("Retro: Delete column", { boardId: boardId });
      })
      .catch((r) => retroClient.handleError(r));
  };

  return (
    <>
      {canManage && (
        <>
          <ConfirmDialog
            open={confirmDelete}
            title={() => `Delete '${column.name}' column?`}
            body="Deleting this column will also delete the cards within it. Are you sure want to continue?"
            okText={state == "ready" ? "Yes, Delete" : "Deleting column..."}
            disabled={state == "deleting"}
            onCancel={() => {
              setConfirmDelete(false);
            }}
            cancelText="Cancel"
            onOk={deleteColumn}
          />
          <EditColumnModal
            column={column}
            open={showEditColumn}
            setOpen={setShowEditColumn}
            afterUpdate={afterUpdate}
            boardId={boardId}
          />
        </>
      )}
      <div className="h-full p-3 pb-0 inline-block whitespace-normal" style={{ width: "400px" }}>
        <div className="w-full h-full">
          <div className="w-full mb-3 flex">
            <div className="w-11/12">
              <h3 className="font-bold text-lg">{column.name}</h3>
              <p className="text-gray-500 text-sm">{pluralize("Card", column.cards?.length || 0, true)}</p>
            </div>
            <div className="w-1/12 flex items-center h-full flex-row-reverse">
              {canManage && (
                <Menu as="div" className="relative z-30">
                  {({ open }) => (
                    <>
                      <Menu.Button>
                        <DotsVerticalIcon className="w-5 h-5 text-gray-500"></DotsVerticalIcon>
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
                                  onClick={() => setShowEditColumn(true)}
                                  className={classNames(
                                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                                    "block w-full text-left px-4 py-2 text-sm"
                                  )}>
                                  Edit column
                                </button>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  className={classNames(
                                    active ? "bg-red-100 text-gray-900" : "text-gray-700",
                                    "block w-full text-left px-4 py-2 text-sm"
                                  )}
                                  onClick={() => setConfirmDelete(true)}>
                                  Remove column
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
          <div className="w-full overflow-hidden relative z-20" style={{ height: "calc(100% - 60px)" }}>
            <Scrollbars autoHide autoHideTimeout={1000}>
              <div className="w-full">
                <CreateCard boardId={boardId} addCard={addCard} columnId={column.id} />
              </div>
              {children}
            </Scrollbars>
          </div>
        </div>
      </div>
    </>
  );
}
