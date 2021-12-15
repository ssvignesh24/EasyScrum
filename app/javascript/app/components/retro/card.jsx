/** @format */

import React, { useEffect, useRef, useState, Fragment } from "react";
import ReactDOM from "react-dom";
import { TrashIcon, PencilIcon, ThumbUpIcon, DotsHorizontalIcon } from "@heroicons/react/solid";
import { ThumbUpIcon as ThumbUpIconOutline } from "@heroicons/react/outline";
import { Primary as PrimaryButton, Muted as MutedButton } from "../button";
import { Menu, Transition } from "@headlessui/react";

import ConfirmDialog from "../confirmdialog";

import Tracking from "../../services/tracking";
import Retro from "../../services/retro";
import pluralize from "pluralize";

const randId = () => {
  return Math.random().toString().slice(5) + "-" + Math.random().toString(36).substring(7);
};

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ({
  card,
  afterDelete,
  afterUpdate,
  addNewComment,
  removeComment,
  board,
  columnId,
  toggleVote,
  afterActionItemAddition,
}) {
  const retroClient = new Retro(board.id);
  const editCardField = useRef();

  const [commentText, setCommentText] = useState("");
  const [updatedMessage, setUpdatedMessage] = useState(card.message);
  const [state, setState] = useState("ready");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => () => retroClient.cancel(), []);

  const addComment = (value) => {
    const tmpCommentId = randId();
    addNewComment(columnId, card.id, {
      message: value,
      loading: true,
      id: tmpCommentId,
      author: board.currentParticipantName,
      participant: { targetParticipantId: board.currentParticipantId },
    });
    retroClient
      .addComment(card.id, columnId, value)
      .then(({ data }) => {
        if (!data.status) return;
        Tracking.logEvent("Retro: Add comment", { boardId: board.id });
        addNewComment(columnId, card.id, data.comment, tmpCommentId);
      })
      .catch((r) => retroClient.handleError(r));
    setCommentText("");
  };

  const handleKeyPress = (e) => {
    if (e.key != "Enter") return;
    addComment(commentText);
  };

  const editCard = () => {
    setState("editing");
    setTimeout(() => editCardField.current.focus(), 0);
  };

  const updateCard = () => {
    if (updatedMessage == card.message) {
      setState("ready");
    } else {
      retroClient
        .updateCard(card.id, columnId, updatedMessage)
        .then(({ data }) => {
          if (!data.status) return;
          setState("ready");
          Tracking.logEvent("Retro: Update card", { boardId: board.id });
          afterUpdate(columnId, data.card);
        })
        .catch((r) => retroClient.handleError(r));
      setState("updating");
    }
  };

  const cancelEdit = () => {
    setState("ready");
    setUpdatedMessage(card.message);
  };

  const deleteCard = (e) => {
    if (state == "deleting") return;
    setState("deleting");
    retroClient
      .deleteCard(columnId, card.id)
      .then(({ data }) => {
        if (!data.status) return;
        Tracking.logEvent("Retro: Delete card", { boardId: board.id, cardId: card.id });
        afterDelete(columnId, card);
      })
      .catch((r) => retroClient.handleError(r));
  };

  const removeCardComment = (comment) => {
    removeComment(columnId, card.id, comment.id);
    retroClient
      .removeComment(card.id, columnId, comment.id)
      .then(({ data }) => {
        if (!data.status) return;
        const comments_ = comments.filter((c) => c.id != comment.id);
        Tracking.logEvent("Retro: Delete comment", { boardId: board.id });
        setComments(comments_);
      })
      .catch((r) => retroClient.handleError(r));
  };

  const addAsActionItem = () => {
    retroClient
      .createActionItem(card.message)
      .then(({ data }) => {
        if (!data.status) return;
        afterActionItemAddition(data.actionItem);
      })
      .catch((r) => retroClient.handleError(r));
  };

  return (
    <>
      <ConfirmDialog
        open={confirmDelete}
        title={() => `Are you sure want to delete this card?`}
        body=""
        okText={state == "ready" ? "Yes, Delete" : "Deleting card..."}
        disabled={state == "deleting"}
        onCancel={() => {
          setConfirmDelete(false);
        }}
        cancelText="Cancel"
        onOk={deleteCard}
      />
      <div
        id={`card-id:${card.id}`}
        className={
          "w-full p-3 bg-white shadow rounded mb-3 retro-card cursor-move  " + (state == "deleting" && "opacity-60")
        }>
        {(state == "editing" || state == "updating") && (
          <>
            <textarea
              className="bg-gray-100 border-0 w-full rounded p-2 outline-none text-sm"
              placeholder="Your message"
              value={updatedMessage}
              ref={editCardField}
              onChange={(e) => setUpdatedMessage(e.target.value)}></textarea>
            <div className="flex flex-row-reverse mt-2">
              <PrimaryButton size="sm" onClick={updateCard} disabled={!updatedMessage || state == "updating"}>
                {state == "updating" && <span className="text-sm">Updating card...</span>}
                {state == "editing" && <span className="text-sm">Update</span>}
              </PrimaryButton>
              <MutedButton onClick={cancelEdit} size="sm" className="mr-2">
                <span className="text-sm">Cancel</span>
              </MutedButton>
            </div>
          </>
        )}
        {(state == "ready" || state == "deleting") && (
          <>
            <pre className="text-sm" style={{ whiteSpace: "break-spaces" }}>
              {card.message}
            </pre>
            {board.anonymousCard === false && card.participant && (
              <p className="mt-3 text-sm font-medium">- {card.participant.name}</p>
            )}
          </>
        )}
        {(state == "ready" || state == "deleting") && (
          <div className="flex mt-3">
            <div className="w-8/12 flex items-center">
              {card.voted && (
                <button
                  className="flex items-center bg-green-50 text-green-700 py-1 px-2 rounded-lg"
                  onClick={() => toggleVote(columnId, card)}>
                  <ThumbUpIcon className="w-4 h-4 mr-1"></ThumbUpIcon>
                  <span className="text-sm">{pluralize("vote", card.voteCount, true)}</span>
                </button>
              )}

              {!card.voted && (
                <button
                  className="flex items-center hover:bg-green-100 py-1 px-2 rounded-lg"
                  onClick={() => toggleVote(columnId, card)}>
                  <ThumbUpIconOutline className="w-4 h-4 mr-1"></ThumbUpIconOutline>
                  <span className="text-sm">{pluralize("vote", card.voteCount, true)}</span>
                </button>
              )}
              <button
                className="flex items-center hover:bg-gray-100 py-1 px-2 rounded-lg ml-1.5"
                onClick={() => setShowComments((value) => !value)}>
                <span className="text-sm">{pluralize("comments", card.comments.filter((c) => c.id).length, true)}</span>
              </button>
            </div>
            <div className="w-4/12 flex flex-row-reverse">
              {card.canManageCard && (
                <>
                  <Menu as="div" className="relative z-30">
                    {({ open }) => (
                      <>
                        <Menu.Button className="h-full">
                          <DotsHorizontalIcon className="w-3.5 h-3.5 text-gray-700" />
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
                                    onClick={editCard}
                                    className={classNames(
                                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                                      "block w-full text-left px-4 py-2 text-sm"
                                    )}>
                                    Edit card
                                  </button>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    onClick={() => setConfirmDelete(true)}
                                    className={classNames(
                                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                                      "block w-full text-left px-4 py-2 text-sm"
                                    )}>
                                    Delete card
                                  </button>
                                )}
                              </Menu.Item>

                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    onClick={addAsActionItem}
                                    className={classNames(
                                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                                      "block w-full text-left px-4 py-2 text-sm"
                                    )}>
                                    Add as action item
                                  </button>
                                )}
                              </Menu.Item>
                            </div>
                          </Menu.Items>
                        </Transition>
                      </>
                    )}
                  </Menu>
                </>
              )}
            </div>
          </div>
        )}
        {showComments && (
          <>
            <hr className="mt-3" />
            <div className="w-full mb-3">
              {card.comments &&
                card.comments.length > 0 &&
                card.comments.map((comment) => {
                  if (!comment.id) return;
                  return (
                    <div
                      className={"w-full text-sm py-3 border-b border-gray-200 " + (comment.loading && "opacity-50")}
                      key={comment.id}>
                      <div className="flex w-full">
                        <div className="font-medium text-blue-600 mb-1">{comment.author}</div>
                      </div>
                      <p className="text-gray-700">{comment.message}</p>
                      <div className="w-full mt-1">
                        {!comment.loading && board.canManageBoard && (
                          <button className="flex text-red-700 items-center" onClick={() => removeCardComment(comment)}>
                            <TrashIcon className="w-3.5 h-3.5 mr-1" />
                            <span>Delete comment</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
            <div className="w-full">
              <input
                className="bg-gray-100 border-0 w-full rounded p-2 outline-none text-sm"
                placeholder="Add comment"
                value={commentText}
                onKeyDown={handleKeyPress}
                onChange={(e) => setCommentText(e.target.value)}
              />
              {commentText && <p className="text-sm text-gray-500 mt-2">Press enter to add comment</p>}
              {/* <div className="flex flex-row-reverse">
              <PrimaryButton size="sm" className="text-sm" disabled={!commentText}>
                Add comment
              </PrimaryButton>
            </div> */}
            </div>
          </>
        )}
      </div>
    </>
  );
}
