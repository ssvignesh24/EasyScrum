/** @format */

import React, { useEffect, useReducer, useRef, useState } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { TrashIcon, PencilIcon } from "@heroicons/react/solid";
import { Primary as PrimaryButton, Muted as MutedButton } from "../button";

import Retro from "../../services/retro";

const randId = () => {
  return Math.random().toString().slice(5) + "-" + Math.random().toString(36).substring(7);
};

export default function ({ card, afterDelete, afterUpdate, addNewComment, removeComment, board, columnId }) {
  const retroClient = new Retro(board.id);
  const editCardField = useRef();

  const [commentText, setCommentText] = useState("");
  const [updatedMessage, setUpdatedMessage] = useState(card.message);
  const [state, setState] = useState("ready");

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
    retroClient
      .deleteCard(columnId, card.id)
      .then(({ data }) => {
        if (!data.status) return;
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
        setComments(comments_);
      })
      .catch((r) => retroClient.handleError(r));
  };

  return (
    <>
      <div className="w-full p-3 bg-white shadow rounded mb-3">
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
        {state == "ready" && <p className="text-sm">{card.message}</p>}
        {card.canManageCard && state == "ready" && (
          <div className="flex mt-3">
            <button className="flex text-green-500 items-center mr-4" onClick={editCard}>
              <PencilIcon className="w-3.5 h-3.5 mr-1" />
              <span className="text-sm">Edit</span>
            </button>
            <button className="flex text-red-700 items-center" onClick={deleteCard}>
              <TrashIcon className="w-3.5 h-3.5 mr-1" />
              <span className="text-sm">Delete</span>
            </button>
          </div>
        )}
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
                    {!comment.loading &&
                      (board.canManageBoard ||
                        comment.participant.targetParticipantId == board.currentParticipantId) && (
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
      </div>
    </>
  );
}
