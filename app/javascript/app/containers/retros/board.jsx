/** @format */

import React, { useEffect, useState, Fragment } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import pluralize from "pluralize";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { Menu, Transition } from "@headlessui/react";

import { Primary as PrimaryButton } from "../../components/button";
import { Column, Card } from "../../components/retro";
import CreateColumnModal from "./modals/create_column";
import InviteUsersModal from "../../components/invite_users";

import Retro from "../../services/retro";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ({ children, boardId }) {
  const retroClient = new Retro(boardId);
  const [showCreateColumn, setShowCreateColumn] = useState(false);
  const [showInviteUsersModal, setShowInviteUsersModal] = useState(false);
  const [state, setState] = useState("loading");
  const [board, setBoard] = useState();

  useEffect(() => {
    retroClient
      .getBoard()
      .then(({ data }) => {
        if (!data.status) return;
        setBoard(data.board);
        setState("loaded");
      })
      .catch((r) =>
        retroClient.handleError(r, () => {
          setState("error");
        })
      );
  }, []);

  const addCard = (columnId, card) => {
    const columns_ = board.columns.map((column) => {
      if (column.id != columnId) return column;
      column.cards = [card].concat(column.cards);
      return column;
    });
    setBoard({ ...board, columns: columns_ });
  };

  const removeCard = (columnId, card) => {
    const columns_ = board.columns.map((column) => {
      if (column.id != columnId) return column;
      column.cards = column.cards.filter((c) => c.id != card.id);
      return column;
    });
    setBoard({ ...board, columns: columns_ });
  };

  const updateCard = (columnId, card) => {
    const columns_ = board.columns.map((column) => {
      if (column.id != columnId) return column;
      column.cards = column.cards.map((c) => {
        if (c.id != card.id) return c;
        c.message = card.message;
        return c;
      });
      return column;
    });
    setBoard({ ...board, columns: columns_ });
  };

  const addColumn = (column) => {
    setBoard({ ...board, columns: board.columns.concat(column) });
  };

  const updateColumn = (column) => {
    const columns_ = board.columns.map((c) => {
      if (column.id != c.id) return c;
      c.name = column.name;
      return c;
    });
    setBoard({ ...board, columns: columns_ });
  };

  const removeColumn = (column) => {
    setBoard({ ...board, columns: board.columns.filter((c) => c.id != column.id) });
  };

  return (
    <>
      <CreateColumnModal
        boardId={boardId}
        open={showCreateColumn}
        setOpen={setShowCreateColumn}
        afterCreate={addColumn}
      />
      {state == "loaded" && (
        <InviteUsersModal
          board={board}
          open={showInviteUsersModal}
          setOpen={setShowInviteUsersModal}
          afterInvite={() => {}}
        />
      )}
      <div className="w-full bg-white flex shadow px-5" style={{ height: "80px" }}>
        <div className="w-9/12 h-full flex justify-center flex-col">
          <p className="font-medium text-lg ">{state == "loaded" && board.name}</p>
          <p className="font-medium text-lg ">{state == "loading" && "Loading retrospective..."}</p>
          <p className="text-gray-500 text-sm">
            {state == "loaded" && pluralize("Participants", board.participantsCount, true)}
          </p>
        </div>
        <div className="w-3/12 flex items-center flex-row-reverse">
          {/* <PrimaryButton className="mr-3">Add column</PrimaryButton> */}
          <div className="flex-shrink-0">
            {state == "loaded" && (
              <Menu as="div" className="relative z-30">
                {({ open }) => (
                  <>
                    <Menu.Button className="mr-3">
                      <PrimaryButton as="div">
                        Board options
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
                          {board.canManageBoard && (
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  onClick={() => setShowCreateColumn(true)}
                                  className={classNames(
                                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                                    "block w-full text-left px-4 py-2 text-sm"
                                  )}>
                                  Add column
                                </button>
                              )}
                            </Menu.Item>
                          )}
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                className={classNames(
                                  active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                                  "block w-full text-left px-4 py-2 text-sm"
                                )}>
                                Show participants
                              </button>
                            )}
                          </Menu.Item>
                          {board.canManageBoard && (
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  className={classNames(
                                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                                    "block w-full text-left px-4 py-2 text-sm"
                                  )}>
                                  Edit board
                                </button>
                              )}
                            </Menu.Item>
                          )}
                          {board.canManageBoard && (
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  className={classNames(
                                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                                    "block w-full text-left px-4 py-2 text-sm"
                                  )}>
                                  Archive board
                                </button>
                              )}
                            </Menu.Item>
                          )}
                          {board.canManageBoard && (
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  className={classNames(
                                    active ? "bg-red-100 text-gray-900" : "text-gray-700",
                                    "block w-full text-left px-4 py-2 text-sm"
                                  )}>
                                  Delete board
                                </button>
                              )}
                            </Menu.Item>
                          )}
                        </div>
                      </Menu.Items>
                    </Transition>
                  </>
                )}
              </Menu>
            )}
          </div>
          <div className="flex-shrink-0">
            <Menu as="div" className="relative z-30">
              {({ open }) => (
                <>
                  <Menu.Button className="mr-3">
                    <PrimaryButton as="div">
                      Action items
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
                              Show action items
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
                              Previous retro action items
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
          <div className="flex-shrink-0">
            <PrimaryButton className="mr-3" onClick={() => setShowInviteUsersModal(true)}>
              Invite users
            </PrimaryButton>
          </div>
        </div>
      </div>
      <div
        className="w-full pt-3 pl-3"
        style={{ height: "calc(100vh - 140px)", overflowX: "hidden", overflowY: "auto" }}>
        <div className="whitespace-nowrap h-full" style={{ overflowY: "auto" }}>
          {state == "loaded" &&
            board?.columns.length > 0 &&
            board.columns.map((column) => {
              return (
                <Column
                  boardId={boardId}
                  column={column}
                  key={column.id}
                  addCard={addCard}
                  afterUpdate={updateColumn}
                  afterDelete={removeColumn}>
                  {column.cards.length > 0 &&
                    column.cards.map((card) => {
                      return (
                        <Card
                          card={card}
                          key={card.id}
                          boardId={boardId}
                          columnId={column.id}
                          afterDelete={removeCard}
                          afterUpdate={updateCard}
                        />
                      );
                    })}
                </Column>
              );
            })}
        </div>
      </div>
    </>
  );
}
