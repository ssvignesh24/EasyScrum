/** @format */

import React, { useEffect, useReducer, useState } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { TrashIcon } from "@heroicons/react/solid";

export default function ({ children }) {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([
    {
      id: 3,
      author: "Vignesh Shanmugasundaram",
      author_type: "guest",
      author_id: 4,
      comment:
        "Lugit est dolore nostrum velit corporis cumque iusto ducimus culpa tenetur aut minima ad? Nam minus debitis repellat pariatur.",
    },
  ]);

  const addComment = (value) => {
    let _comments = comments.concat({
      id: 4,
      comment: value,
      author: "You",
    });
    setCommentText("");
    setComments(_comments);
  };

  const handleKeyPress = (e) => {
    if (e.key != "Enter") return;
    addComment(commentText);
  };

  return (
    <>
      <div className="w-full p-3 bg-white shadow rounded mb-3">
        <p className="text-sm">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias consequuntur commodi, fugit est dolore
          nostrum velit corporis cumque iusto ducimus culpa tenetur aut minima ad? Nam minus debitis repellat pariatur.
        </p>
        <hr className="mt-3" />
        <div className="w-full mb-3">
          {comments &&
            comments.length > 0 &&
            comments.map((comment) => {
              return (
                <div className="w-full text-sm py-3 border-b border-gray-200" key={comment.id}>
                  <div className="flex w-full">
                    <div className="font-medium text-blue-600 mb-1">{comment.author}</div>
                  </div>
                  <p className="text-gray-700">{comment.comment}</p>
                  <div className="w-full mt-1">
                    <button className="flex text-red-700 items-center">
                      <TrashIcon className="w-3.5 h-3.5 mr-1" />
                      <span>Delete comment</span>
                    </button>
                  </div>
                </div>
              );
            })}

          {/* <div className="w-full text-sm mb-2">
            <p className="font-medium text-blue-600 mb-1">Vignesh Shanmugasundaram</p>
            <p className="text-gray-700">
              Lugit est dolore nostrum velit corporis cumque iusto ducimus culpa tenetur aut minima ad? Nam minus
              debitis repellat pariatur.
            </p>
          </div> */}
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
