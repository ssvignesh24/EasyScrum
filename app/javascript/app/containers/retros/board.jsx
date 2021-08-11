/** @format */

import React, { useEffect, useState, Fragment } from "react";
import ReactDOM from "react-dom";
import pluralize from "pluralize";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { Menu, Transition } from "@headlessui/react";
import { Redirect } from "@reach/router";
import { ReactSortable } from "react-sortablejs";

import { Primary as PrimaryButton } from "../../components/button";
import { Column, Card } from "../../components/retro";
import CreateColumnModal from "./modals/create_column";
import ParticipantsModal from "./modals/participants";
import RenameBoardModal from "./modals/rename_board";
import InviteUsersModal from "../../components/invite_users";
import consumer from "../../lib/action_cable_consumer";
import ConfirmDialog from "../../components/confirmdialog";
import ActionPanel from "../../components/retro/action_panel";

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
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteState, setDeleteState] = useState("init");
  const [showActionItemColumn, setShowActionItemColumn] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showRenameBoard, setShowRenameBoard] = useState(false);

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

    return () => retroClient.cancel();
  }, []);

  useEffect(() => {
    if (state != "loaded") return;
    subscribeToBoard();
  }, [state]);

  const deleteBoard = () => {
    setDeleteState("deleting");
    retroClient
      .deleteBoard()
      .then(({ data }) => {
        if (!data.status) return;
        setTimeout(() => setDeleteState("deleted"), 1000);
      })
      .catch((r) => retroClient.handleError(r));
  };

  const subscribeToBoard = () => {
    consumer.subscriptions.create(
      { channel: "RetroBoardChannel", board_id: board.id },
      {
        received(data) {
          const { status, originParticipantId, type } = data;
          let card;
          if (!status) return;
          if (board.currentParticipantId == originParticipantId) return;
          switch (type) {
            case "new_column":
              addColumn(data.column);
              break;
            case "update_column":
              updateColumn(data.column);
            case "remove_column":
              removeColumn({ id: data.columnId });
              break;
            case "new_card":
              card = {
                ...data.card,
                canManageCard: board.canManageBoard,
              };
              addCard(data.columnId, card);
              break;
            case "update_card":
              card = {
                ...data.card,
                canManageCard: board.canManageBoard,
              };
              updateCard(data.columnId, data.card);
              break;
            case "remove_card":
              removeCard(data.columnId, { id: data.cardId });
              break;
            case "new_comment":
              addNewComment(data.columnId, data.cardId, data.comment);
              break;
            case "remove_comment":
              removeComment(data.columnId, data.cardId, data.commentId);
              break;
            case "rearrange":
              const { affectedColumns } = data;
              let needsActionInCols;
              if (affectedColumns.length == 2 && affectedColumns[0].id == affectedColumns[1].id) {
                needsActionInCols = [affectedColumns[0]];
              } else {
                needsActionInCols = affectedColumns;
              }
              setBoard((board_) => {
                return {
                  ...board_,
                  columns: board_.columns.map((col) => {
                    if (col.id == needsActionInCols[0].id) {
                      col.cards = needsActionInCols[0].cards;
                    } else if (needsActionInCols[1] && col.id == needsActionInCols[1].id) {
                      col.cards = needsActionInCols[1].cards;
                    }
                    return col;
                  }),
                };
              });
              break;
            case "create_action_item":
              addActionItem(data.actionItem);
              break;
            case "toggle_action_item":
              updateActionItem(data.actionItem);
              break;
            case "delete_action_item":
              deleteActionItem(data.actionItem);
              break;
            default:
              break;
          }
        },
      }
    );
  };

  const addCard = (columnId, card) => {
    setBoard((board_) => {
      return {
        ...board_,
        columns: board_.columns.map((column) => {
          if (column.id != columnId) return column;
          column.cards = [card].concat(column.cards);
          return column;
        }),
      };
    });
  };

  const removeCard = (columnId, card) => {
    setBoard((board_) => {
      return {
        ...board_,
        columns: board_.columns.map((column) => {
          if (column.id != columnId) return column;
          column.cards = column.cards.filter((c) => c.id != card.id);
          return column;
        }),
      };
    });
  };

  const updateCard = (columnId, card) => {
    setBoard((board_) => {
      return {
        ...board_,
        columns: board_.columns.map((column) => {
          if (column.id != columnId) return column;
          column.cards = column.cards.map((c) => {
            if (c.id != card.id) return c;
            c.message = card.message;
            return c;
          });
          return column;
        }),
      };
    });
  };

  const addNewComment = (columnId, cardId, comment, oldId = false) => {
    setBoard((board_) => {
      return {
        ...board_,
        columns: board_.columns.map((column) => {
          if (column.id != columnId) return column;
          column.cards = column.cards.map((c) => {
            if (c.id != cardId) return c;
            c.comments = c.comments.map((cmt) => {
              if (cmt.id == oldId) return {};
              return cmt;
            });
            c.comments = c.comments.concat(comment);
            return c;
          });
          return column;
        }),
      };
    });
  };

  const removeComment = (columnId, cardId, commentId) => {
    setBoard((board_) => {
      return {
        ...board_,
        columns: board_.columns.map((column) => {
          if (column.id != columnId) return column;
          column.cards = column.cards.map((c) => {
            if (c.id != cardId) return c;
            c.comments = c.comments.filter((cmt) => cmt.id != commentId);
            return c;
          });
          return column;
        }),
      };
    });
  };

  const addColumn = (column) => {
    setBoard((board_) => {
      return { ...board_, columns: board_.columns.concat(column) };
    });
  };

  const updateColumn = (column) => {
    setBoard((board_) => {
      return {
        ...board_,
        columns: board_.columns.map((c) => {
          if (column.id != c.id) return c;
          c.name = column.name;
          return c;
        }),
      };
    });
  };

  const removeColumn = (column) => {
    setBoard((board_) => {
      return { ...board_, columns: board_.columns.filter((c) => c.id != column.id) };
    });
  };

  const setCards = (columnId, cards) => {
    setBoard((board_) => {
      return {
        ...board_,
        columns: board_.columns.map((col) => {
          if (col.id == columnId) col.cards = cards;
          return col;
        }),
      };
    });
  };

  const updateCards = (colId, e) => {
    const { item, to, from, oldIndex, newIndex } = e;
    const itemId = item.id.split(":")[1];
    const toColId = to.id.split(":")[1];
    const fromColId = from.id.split(":")[1];
    if (oldIndex == newIndex && toColId == fromColId) return;
    const payload = {
      to_column_id: toColId,
      from_column_id: fromColId,
      old_index: oldIndex + 1,
      new_index: newIndex + 1,
    };
    retroClient
      .rearrangeCard(colId, itemId, payload)
      .then(({ data }) => {
        if (!data.status) return;
      })
      .catch((r) => retroClient.handleError(r));
  };

  const addActionItem = (actionItem) => {
    setBoard((board_) => {
      return {
        ...board_,
        actionItems: [actionItem].concat(board_.actionItems),
      };
    });
  };

  const updateActionItem = (actionItem) => {
    setBoard((board_) => {
      return {
        ...board_,
        actionItems: board_.actionItems.map((item) => {
          if (item.id == actionItem.id) {
            item.status = actionItem.status;
            item.actionMessage = actionItem.actionMessage;
          }
          return item;
        }),
      };
    });
  };

  const deleteActionItem = (actionItem) => {
    setBoard((board_) => {
      return {
        ...board_,
        actionItems: board_.actionItems.filter((item) => actionItem.id != item.id),
      };
    });
  };

  const renameBoard = (name) => {
    setBoard((board_) => {
      return {
        ...board_,
        name: name,
      };
    });
  };

  const removeParticipant = (participantId) => {
    setBoard((board_) => {
      return {
        ...board_,
        participants: board_.participants.filter((p) => p.id != participantId),
      };
    });
  };

  return (
    <>
      {state == "loaded" && (
        <>
          <ActionPanel
            currentActionItems={board.actionItems}
            previousActionItems={board.previousActionItems}
            previousRetroName={board.previousRetroName}
            open={showActionItemColumn}
            setOpen={setShowActionItemColumn}
            afterCreate={addActionItem}
            afterUpdate={updateActionItem}
            afterDelete={deleteActionItem}
            board={board}
          />
          <ParticipantsModal
            open={showParticipants}
            setOpen={setShowParticipants}
            board={board}
            afterRemove={removeParticipant}
          />
          <RenameBoardModal
            open={showRenameBoard}
            setOpen={setShowRenameBoard}
            board={board}
            afterRename={renameBoard}></RenameBoardModal>
        </>
      )}
      {deleteState == "deleted" && <Redirect to={"/retro"} noThrow />}
      {state == "loaded" && board.canManageBoard && (
        <>
          <ConfirmDialog
            open={confirmDelete}
            title={() => `Delete ${board.name || ""}?`}
            body="Deleting the board will delete all its cards and action items. Are you sure want to delete this board?"
            okText={deleteState == "init" ? "Yes, Delete" : "Deleting board..."}
            disabled={deleteState == "deleting"}
            onCancel={() => {
              setConfirmDelete(false);
            }}
            cancelText="Cancel"
            onOk={deleteBoard}
          />
          <CreateColumnModal
            boardId={boardId}
            open={showCreateColumn}
            setOpen={setShowCreateColumn}
            afterCreate={addColumn}
          />
        </>
      )}

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
        {state == "loaded" && (
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
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  onClick={() => setShowParticipants(true)}
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
                                    onClick={() => setShowRenameBoard(true)}
                                    className={classNames(
                                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                                      "block w-full text-left px-4 py-2 text-sm"
                                    )}>
                                    Rename board
                                  </button>
                                )}
                              </Menu.Item>
                            )}
                            {/* {board.canManageBoard && (
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
                            )} */}
                            {board.canManageBoard && (
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    className={classNames(
                                      active ? "bg-red-100 text-gray-900" : "text-gray-700",
                                      "block w-full text-left px-4 py-2 text-sm"
                                    )}
                                    onClick={() => setConfirmDelete(true)}>
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
            <div className="flex-shrink-0 mr-3 cursor-pointer">
              <PrimaryButton as="div" onClick={() => setShowActionItemColumn(true)}>
                Action items
              </PrimaryButton>
            </div>
            <div className="flex-shrink-0">
              <PrimaryButton className="mr-3" onClick={() => setShowInviteUsersModal(true)}>
                Invite users
              </PrimaryButton>
            </div>
          </div>
        )}
      </div>
      <div
        className="w-full pt-3 pl-3 flex relative z-20"
        style={{ height: "calc(100vh - 140px)", overflowX: "hidden", overflowY: "hidden" }}>
        <div className="whitespace-nowrap h-full w-full" style={{ overflowY: "hidden" }}>
          {state == "loaded" &&
            board?.columns.length > 0 &&
            board.columns.map((column) => {
              return (
                <Column
                  boardId={boardId}
                  column={column}
                  key={column.id}
                  addCard={addCard}
                  canManage={board.canManageBoard}
                  afterUpdate={updateColumn}
                  afterDelete={removeColumn}>
                  <ReactSortable
                    className="py-5 rounded"
                    style={{ minHeight: "400px" }}
                    id={`col-id:${column.id}`}
                    group="cards"
                    list={column.cards}
                    onEnd={(e) => updateCards(column.id, e)}
                    setList={(cards) => setCards(column.id, cards)}>
                    {column.cards.length > 0 &&
                      column.cards.map((card) => {
                        return (
                          <Card
                            card={card}
                            key={card.id}
                            board={board}
                            columnId={column.id}
                            afterDelete={removeCard}
                            afterUpdate={updateCard}
                            addNewComment={addNewComment}
                            removeComment={removeComment}
                          />
                        );
                      })}
                  </ReactSortable>
                </Column>
              );
            })}
          {state == "loaded" && board.canManageBoard && (
            <>
              <div className="h-full p-3 inline-block whitespace-normal align-top" style={{ width: "400px" }}>
                <div className="w-full">
                  <button
                    onClick={() => setShowCreateColumn(true)}
                    className="w-full p-3 bg-white shadow rounded mb-3 text-center">
                    + Add column
                  </button>
                </div>
              </div>
            </>
          )}
          {state == "loading" && (
            <>
              <div className="flex">
                {_.times(4, (n) => {
                  return (
                    <div key={n} className="p-3" style={{ width: "400px" }}>
                      <div className="w-8/12 h-3 mb-5 mb-4 rounded-xl bg-gray-300"></div>
                      <div className="bg-white py-5 shadow rounded mb-5 flex justify-center items-center">
                        <div className="w-5/12 h-2.5 rounded-xl bg-gray-200 animate-pulse"></div>
                      </div>
                      {_.times(4 - n, (m) => {
                        return (
                          <div key={m} className="bg-white p-3 shadow rounded mb-5 ">
                            <div className="w-full h-2.5 mb-3.5 rounded-xl bg-gray-200 animate-pulse"></div>
                            <div className="w-full h-2.5 mb-3.5 rounded-xl bg-gray-200 animate-pulse"></div>
                            <div className="w-8/12 h-2.5 mb-3.5 rounded-xl bg-gray-200 animate-pulse"></div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
