/** @format */

import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import pluralize from "pluralize";

function VoteResults({ votes, board }) {
  const highestVote = () => {
    if (votes.length == 0) return "-";
    for (const { value } of board.availableVotes.concat([]).reverse()) {
      const firstVote = votes.find(({ vote }) => vote.value == value)?.vote?.value;
      if (firstVote) return firstVote;
    }
    return "";
  };

  const lowestVote = () => {
    if (votes.length == 0) return "-";
    for (const { value } of board.availableVotes) {
      const firstVote = votes.find(({ vote }) => vote.value == value)?.vote?.value;
      if (firstVote) return firstVote;
    }
    return "";
  };

  const avgVote = () => {
    if (votes.length == 0) return "-";
    const allVotes = votes
      .filter((v) => {
        return v.vote.type == "number";
      })
      .map((v) => +v.vote.value);
    const voteSum = allVotes.reduce((a, value) => a + value, 0);
    return Math.round((voteSum / allVotes.length) * 100) / 100;
  };

  const mostVoted = () => {
    if (votes.length == 0) return ["-"];
    let mostVote = [],
      mostVoteCount = 0;
    for (const { value } of board.availableVotes) {
      const count = votes.filter(({ vote }) => vote.value == value).length || -1;
      if (count > mostVoteCount) {
        mostVote = [value];
        mostVoteCount = count;
      } else if (count == mostVoteCount) mostVote.push(value);
    }
    return mostVote;
  };

  return (
    <>
      <div className="w-full">
        <div className="w-full flex items-center mb-2">
          <div className="w-8/12 text-gray-600">Total votes</div>
          <div className="w-4/12 flex flex-row-reverse font-medium">
            <span>&ensp;{pluralize("vote", votes.length || 0)}</span>
            <span className="text-purple-500">{votes.length || 0}</span>
          </div>
        </div>
        <div className="w-full flex items-center mb-2">
          <div className="w-8/12 text-gray-600">Highest vote</div>
          <div className="w-4/12 flex flex-row-reverse font-medium">
            <span>&ensp;points</span>
            <span className="text-purple-500">{highestVote()}</span>
          </div>
        </div>
        <div className="w-full flex items-center mb-2">
          <div className="w-8/12 text-gray-600">Lowest vote</div>
          <div className="w-4/12 flex flex-row-reverse font-medium">
            <span>&ensp;points</span>
            <span className="text-purple-500">{lowestVote()}</span>
          </div>
        </div>
        <div className="w-full flex items-center mb-2">
          <div className="w-8/12 text-gray-600">Average vote</div>
          <div className="w-4/12 flex flex-row-reverse font-medium">
            <span>&ensp;points</span>
            <span className="text-purple-500">{avgVote()}</span>
          </div>
        </div>
        <div className="w-full flex items-center mb-2">
          <div className="w-8/12 text-gray-600">Most voted</div>
          <div className="w-4/12 flex flex-row-reverse font-medium">
            <span>&ensp;points</span>
            <span className="text-purple-500">{mostVoted().join(", ")}</span>
          </div>
        </div>
      </div>
    </>
  );
}

VoteResults.propTypes = {
  votes: PropTypes.array.isRequired,
  board: PropTypes.any.isRequired,
};

export default VoteResults;
