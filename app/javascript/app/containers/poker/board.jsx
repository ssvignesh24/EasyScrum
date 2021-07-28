/** @format */

import React, { useEffect, useReducer, useState } from "react";
import ReactDOM from "react-dom";
import { Scrollbars } from "react-custom-scrollbars";
import { PlayIcon, PauseIcon, CheckCircleIcon } from "@heroicons/react/solid";
import { CheckIcon, ClockIcon } from "@heroicons/react/outline";
import pluralize from "pluralize";
import { Link } from "@reach/router";
import ConfirmDialog from "../../components/confirmdialog";
import truncate from "../../lib/truncate";

import Poker from "../../services/poker";
import InviteUsersModal from "../../components/invite_users";
import CreateIssueModal from "./modals/create_issue";
import AssignPointsModal from "./modals/assign_points";

import { Primary as PrimaryButton } from "../../components/button";

const STATUS = {
  ADDED: "added",
  SELECTED: "selected",
  VOTING: "voting",
  VOTED: "voted",
  FINISHED: "finished",
};

const GHOST_ISSUE = {
  SUMMARY: "Ghost issue",
  DESCRIPTION: "Use this issue to vote if you don't want to add issues",
};
export default function ({ children, boardId }) {
  const pokerClient = new Poker(boardId);
  let timer;

  const [manualCounterReset, setManualCounterReset] = useState(true);
  const [pauseCounter, setPauseCounter] = useState(false);
  const [counter, setCounter] = useState(0);
  const [showInviteUsersModal, setShowInviteUsersModal] = useState(false);
  const [showAssignPointsModal, setShowAssignPointsModal] = useState(false);
  const [showAddIssueModal, setShowAddIssueModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState();
  const [state, setState] = useState("loading");
  const [board, setBoard] = useState();
  const [showIssueRemoveConfirmation, setShowIssueRemoveConfirmation] = useState(false);
  const [deletingIssue, setDeletingIssue] = useState();

  useEffect(() => {
    pokerClient
      .getBoard()
      .then(({ data }) => {
        if (!data.status) return;
        setBoard(data.board);
        const si = data.board.issues.find((i) => i.isSelected);
        if (si) {
          setSelectedIssue(si);
        }
        setState("loaded");
      })
      .catch((r) =>
        pokerClient.handleError(r, () => {
          setState("error");
        })
      );
  }, []);

  useEffect(() => {
    if (manualCounterReset) {
      setManualCounterReset(false);
      return;
    }
    if (timer) clearInterval(timer);
    timer = setTimeout(() => {
      if (pauseCounter) return;
      setCounter(counter + 1);
    }, 1000);
  }, [counter]);

  const startCounter = () => {
    if (counter == 0) setTimeout(() => setCounter(counter + 1), 1000);
    else setTimeout(() => setCounter(0), 1000);
  };

  const stopCounter = () => {
    if (timer) clearInterval(timer);
  };

  const startVoting = () => {
    setSelectedIssue({ ...selectedIssue, status: STATUS.VOTING });
    pokerClient
      .updateIssueStatus(selectedIssue.id, STATUS.VOTING)
      .then(({ data }) => {
        if (!data.status) return;
      })
      .catch((r) => pokerClient.handleError(r));
    startCounter();
  };

  const pauseVoting = () => {
    let _pauseCounter = !pauseCounter;
    setPauseCounter(_pauseCounter);
    if (_pauseCounter) setSelectedIssue({ ...selectedIssue, status: "paused" });
    else {
      setSelectedIssue({ ...selectedIssue, status: STATUS.VOTING });
      setTimeout(() => setCounter(counter + 1), 1000);
    }
  };

  const updateIssuePoints = (issueId, points) => {
    setBoard({
      ...board,
      issues: board.issues.map((i) => {
        if (i.id == issueId) i.votes.finalStoryPoint = points;
        return i;
      }),
    });
  };

  const updateIssueStatus = (issueId, status) => {
    if (selectedIssue?.id == issueId) {
      setSelectedIssue({
        ...selectedIssue,
        status: status,
      });
    }
    setBoard({
      ...board,
      issues: board.issues.map((i) => {
        if (i.id == issueId) i.status = status;
        return i;
      }),
    });
  };

  const clearVotes = (issueId) => {
    const emptyVotes = {
      finalStoryPoint: null,
      avgStoryPoint: null,
      totalVotes: null,
      currentUserVote: null,
      participant_votes: [],
    };
    if (selectedIssue?.id == issueId) {
      setSelectedIssue({
        ...selectedIssue,
        status: STATUS.ADDED,
        votes: emptyVotes,
      });
    }
    setBoard({
      ...board,
      issues: board.issues.map((i) => {
        if (i.id == issueId) {
          i.votes = emptyVotes;
          i.status = STATUS.ADDED;
        }
        return i;
      }),
    });
    pokerClient.clearVotes(selectedIssue.id).catch((r) => pokerClient.handleError(r));
  };

  const restVotes = () => {
    if (!selectedIssue.isGhost) return;
    clearVotes(selectedIssue.id);
  };

  const finishVoting = () => {
    stopCounter();
    setSelectedIssue({ ...selectedIssue, status: STATUS.VOTED });
    pokerClient
      .updateIssueStatus(selectedIssue.id, STATUS.VOTED)
      .then(({ data }) => {
        if (!data.status) return;
      })
      .catch((r) => pokerClient.handleError(r));
  };

  const addIssue = (issue) => {
    setBoard({ ...board, issues: [issue].concat(board.issues) });
  };

  const confirmRemoveIssue = (e, issue) => {
    setDeletingIssue(issue);
    e.stopPropagation();
    setShowIssueRemoveConfirmation(true);
  };

  const removeIssue = () => {
    if (!deletingIssue) return;
    setShowIssueRemoveConfirmation(false);
    if (deletingIssue.id == selectedIssue.id) setSelectedIssue(false);
    setBoard({ ...board, issues: board.issues.filter((i) => i.id != deletingIssue.id) });
    pokerClient.removeIssue(deletingIssue.id).catch((r) => handleError(r));
  };

  const selectIssue = (issue) => {
    if (!board?.canManageBoard) return;
    setBoard({
      ...board,
      issues: board.issues.map((i) => {
        if (i.id != issue.id && i.isSelected) i.isSelected = false;
        else if (i.id == issue.id) i.isSelected = true;
        return i;
      }),
    });
    setSelectedIssue(issue);
    pokerClient
      .updateIssueStatus(issue.id, "selected")
      .then(({ data }) => {
        if (!data.status) return;
      })
      .catch((r) => pokerClient.handleError(r));
  };

  const vote = (vote) => {
    if (selectedIssue.status != "voting") return;
    console.log({ ...selectedIssue, votes: { ...selectedIssue.votes, currentUserVote: vote } });
    setSelectedIssue({ ...selectedIssue, votes: { ...selectedIssue.votes, currentUserVote: vote } });
    setBoard({
      ...board,
      issues: board.issues.map((i) => {
        if (i.id == selectedIssue.id) i.votes.currentUserVote = vote;
        return i;
      }),
    });
    pokerClient
      .vote(selectedIssue.id, vote)
      .then(({ data }) => {})
      .catch((r) => pokerClient.handleError(r));
  };

  const getVoteOfParticipant = (participant_id) => {
    if (!selectedIssue) return;
    const participant_votes = selectedIssue.votes.participant_votes;
    return participant_votes.find((p) => {
      return p.targent_participant_id == participant_id;
    })?.vote;
  };

  return (
    <>
      {selectedIssue && (
        <AssignPointsModal
          board={board}
          issue={selectedIssue}
          open={showAssignPointsModal}
          setOpen={setShowAssignPointsModal}
          afterUpdate={(issue) => {
            updateIssueStatus(issue.id, issue.status);
            updateIssuePoints(issue.id, issue.votes.finalStoryPoint);
          }}
        />
      )}
      <ConfirmDialog
        open={showIssueRemoveConfirmation}
        title={() => `Remove ${deletingIssue?.summary || ""}?`}
        body="Removing this issue will remove all its votes too and you can't undo the action. Are you sure want to remove this issue?"
        okText="Yes, Remove"
        onCancel={() => {
          setShowIssueRemoveConfirmation(false);
          setTimeout(() => setDeletingIssue(false), 250);
        }}
        cancelText="Cancel"
        onOk={removeIssue}
      />
      {state == "loaded" && (
        <>
          <InviteUsersModal
            board={board}
            open={showInviteUsersModal}
            setOpen={setShowInviteUsersModal}
            afterInvite={() => {}}
          />
          <CreateIssueModal
            board={board}
            open={showAddIssueModal}
            setOpen={setShowAddIssueModal}
            afterCreate={addIssue}
          />
        </>
      )}
      <div className="w-full bg-white flex shadow px-5 z-20 relative" style={{ height: "80px" }}>
        <div className="w-9/12 h-full flex justify-center flex-col">
          {state == "loading" && <p className="font-medium text-lg ">Loading board...</p>}
          {state == "loaded" && <p className="font-medium text-lg">{board.name}</p>}
          {state == "loaded" && (
            <p className="text-gray-500 text-sm">{pluralize("player", board.participantsCount, true)}</p>
          )}
        </div>
        <div className="w-3/12 flex items-center flex-row-reverse">
          <PrimaryButton className="mr-3" onClick={() => setShowAddIssueModal(true)}>
            Add issue
          </PrimaryButton>
          <PrimaryButton className="mr-3" onClick={() => setShowInviteUsersModal(true)}>
            Invite users
          </PrimaryButton>
        </div>
      </div>
      <div className="w-full z-10 relative" style={{ height: "calc(100vh - 140px)", overflow: "hidden" }}>
        <div className="w-full h-full flex">
          <div className="w-3/12 h-full">
            <Scrollbars>
              <div className="p-5">
                <p className="text-lg font-medium mb-2">Issues</p>
                {state == "loaded" &&
                  board.issues &&
                  board.issues.length > 0 &&
                  board.issues.map((issue) => {
                    return (
                      <div
                        key={issue.id}
                        className={
                          "w-full p-3 bg-white shadow rounded mb-4 cursor-pointer border-l-4 flex " +
                          (issue.id == selectedIssue?.id ? "border-green-500" : "border-white")
                        }
                        onClick={() => selectIssue(issue)}>
                        <div className="w-full pr-1">
                          {!issue.isGhost && (
                            <>
                              <p className={"font-medium" + (issue.status == STATUS.FINISHED ? " line-through " : "")}>
                                {issue.summary}
                              </p>
                              <p className="text-gray-600 text-sm mt-1">{truncate(issue.description, 100)}</p>
                            </>
                          )}

                          {issue.isGhost && (
                            <>
                              <p className="font-medium text-gray-500">{GHOST_ISSUE.SUMMARY}</p>
                              <p className="text-gray-600 text-sm"> {GHOST_ISSUE.DESCRIPTION}</p>
                            </>
                          )}
                          {!issue.isGhost && board?.canManageBoard && (
                            <button className="text-red-500 text-sm mt-2" onClick={(e) => confirmRemoveIssue(e, issue)}>
                              Remove issue
                            </button>
                          )}
                        </div>
                        {issue.status == STATUS.FINISHED && (
                          <div className="w-8 h-8 bg-purple-500 rounded-full text-white flex items-center justify-center flex-shrink-0 flex-grow-0">
                            {issue.votes.finalStoryPoint}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </Scrollbars>
          </div>
          <div className="w-6/12 h-full border-r border-gray-200 bg-white shadow">
            <div className="w-full h-3/5">
              <div className="pmx-5 w-full">
                <div className="p-3 text-black bg-purple-200 w-full border-b border-purple-400">
                  <p className="">
                    {state == "loading" && "Loading board data..."}
                    {state == "loaded" &&
                      !selectedIssue &&
                      board?.canManageBoard &&
                      "Please select an issue to start voting"}
                    {state == "loaded" &&
                      !selectedIssue &&
                      !board?.canManageBoard &&
                      "Waiting for the facilitator to select an issue"}
                    {state == "loaded" && selectedIssue && (
                      <>
                        {board?.canManageBoard && (
                          <>
                            {selectedIssue.status == STATUS.ADDED && "Click 'Start voting' to begin voting"}
                            {selectedIssue.status == STATUS.VOTING &&
                              "Voting in progress. Click 'Finish voting' after all participants voted to view results"}
                            {selectedIssue.status == STATUS.VOTED && !selectedIssue.isGhost && "Click 'Next issue'"}
                            {selectedIssue.status == STATUS.VOTED &&
                              selectedIssue.isGhost &&
                              "Click 'Reset votes' to begin voting again"}
                            {selectedIssue.status == STATUS.FINISHED &&
                              "You have assigned points to this issue. Please click next issue to start voting"}
                          </>
                        )}
                        {!board?.canManageBoard && (
                          <>
                            {selectedIssue.status == STATUS.ADDED && "Waiting for the facilitator to begin voting"}
                            {selectedIssue.status == STATUS.VOTING && "You can cast your vote for this issue now"}
                            {selectedIssue.status == STATUS.VOTED &&
                              "Waiting for the facilitator to select the next issue"}
                            {selectedIssue.status == STATUS.FINISHED &&
                              "Story points assigned to this issue. Waiting for the facilitator to select another issue"}
                          </>
                        )}
                      </>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex h-16">
                <div className="w-8/12 flex justify-center flex-col">
                  <p className="font-medium px-5 text-lg">Current issue</p>
                </div>
                {selectedIssue && (
                  <div className="w-4/12 flex flex-row-reverse items-center">
                    {board?.canManageBoard && (
                      <div>
                        {!selectedIssue.isGhost && selectedIssue.status == STATUS.VOTED && (
                          <PrimaryButton
                            size="sm"
                            className="text-sm mr-3 flex-grow-0"
                            onClick={() => setShowAssignPointsModal(true)}>
                            <div className="inline-block h-5"></div>
                            <span>Assign story points to issue</span>
                          </PrimaryButton>
                        )}
                        {!selectedIssue.isGhost && selectedIssue.status == STATUS.FINISHED && (
                          <PrimaryButton
                            size="sm"
                            className="text-sm mr-3 flex-grow-0"
                            onClick={() => clearVotes(selectedIssue.id)}>
                            <div className="inline-block h-5"></div>
                            <span>Clear votes and revote</span>
                          </PrimaryButton>
                        )}
                        {selectedIssue.isGhost &&
                          (selectedIssue.status == STATUS.VOTED || selectedIssue.status == STATUS.FINISHED) && (
                            <PrimaryButton size="sm" className="text-sm mr-3 flex-grow-0" onClick={restVotes}>
                              <div className="inline-block h-5"></div>
                              <span>Reset votes</span>
                            </PrimaryButton>
                          )}
                        {selectedIssue.status == STATUS.ADDED && (
                          <PrimaryButton size="sm" className="text-sm mr-3 flex-grow-0" onClick={startVoting}>
                            <PlayIcon className="w-5 h-5 text-white mr-2"></PlayIcon>
                            <span>Start voting</span>
                          </PrimaryButton>
                        )}
                        {(selectedIssue.status == STATUS.VOTING || selectedIssue.status == "paused") && (
                          <>
                            {/* <PrimaryButton size="sm" className="text-sm mr-3 flex-grow-0" onClick={pauseVoting}>
                              {selectedIssue.status == "voting" && (
                                <PauseIcon className="w-5 h-5 text-white mr-2"></PauseIcon>
                              )}
                              {selectedIssue.status == "paused" && (
                                <PlayIcon className="w-5 h-5 text-white mr-2"></PlayIcon>
                              )}
                              {counter}
                            </PrimaryButton> */}
                            <PrimaryButton size="sm" className="text-sm mr-3 flex-grow-0" onClick={finishVoting}>
                              <CheckCircleIcon className="w-5 h-5 text-white mr-2"></CheckCircleIcon>
                              Finish voting
                            </PrimaryButton>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="w-full">
                {!selectedIssue && (
                  <>
                    <div className="w-full h-full flex items-center justify-center">
                      <p className="text-gray-500 px-5 mt-2">No issue selected</p>
                    </div>
                  </>
                )}
                {selectedIssue && (
                  <>
                    {!selectedIssue.isGhost && (
                      <>
                        <div className="px-5">
                          <p className="pt-2 font-medium">{selectedIssue.summary}</p>
                          {selectedIssue.link && (
                            <Link to={selectedIssue.link} className="text-sm mb-2 text-green-500">
                              View issue
                            </Link>
                          )}
                          <p className="pb-2 mt-1">{selectedIssue.description}</p>
                        </div>
                      </>
                    )}
                    {selectedIssue.isGhost && (
                      <>
                        <div className="px-5">
                          <p className="pt-2 mb-1 font-medium text-indigo-500">{GHOST_ISSUE.SUMMARY}</p>
                          <p className="pb-2">{GHOST_ISSUE.DESCRIPTION}</p>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
            <div className="w-full h-2/5 pb-20 border-t border-gray-200">
              <p className="font-medium text-lg px-5 mb-2 mt-3">Your vote</p>
              <div className="h-full w-full flex flex-wrap justify-center px-3">
                {state == "loaded" &&
                  board.availableVotes &&
                  board.availableVotes.length > 0 &&
                  board.availableVotes.map((v) => {
                    return (
                      <div className="p-3 w-32 h-32" key={v}>
                        <div
                          onClick={() => vote(v)}
                          className={
                            "shadow border border-gray-200 rounded w-full h-full cursor-pointer transition-colors flex items-center justify-center text-xl font-medium " +
                            (selectedIssue && selectedIssue.votes.currentUserVote == v
                              ? "bg-green-500 hover:bg-green-500 text-white"
                              : "bg-white") +
                            (selectedIssue?.status != "voting"
                              ? " cursor-not-allowed opacity-60 "
                              : " cursor-normal hover:bg-green-50")
                          }>
                          {v}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
          <div className="w-3/12 h-full bg-white">
            <div className="w-full h-3/5">
              <p className="font-medium pt-5 pb-2 px-5 text-lg">Players</p>
              {selectedIssue && (
                <ul>
                  {state == "loaded" &&
                    board.participants?.length > 0 &&
                    board.participants.map((participant) => {
                      const participant_vote = getVoteOfParticipant(participant.id);
                      return (
                        <li
                          className="w-full py-3 px-5 flex items-center hover:bg-gray-100 transition-colors"
                          key={participant.id}>
                          <div className="w-9/12 h-full flex justify-center flex-col">
                            <p>{participant.name}</p>
                            <p className="text-sm text-gray-500">{participant.email}</p>
                          </div>
                          <div className="w-3/12 h-full flex items-center flex-row-reverse">
                            {selectedIssue && (
                              <div className="h-10 w-10 rounded-full bg-purple-500 text-center flex items-center justify-center text-white">
                                {selectedIssue.status == STATUS.ADDED && (
                                  <ClockIcon className="w-5 h-5 text-gray-100" />
                                )}

                                {selectedIssue.status == STATUS.VOTING && !participant_vote && (
                                  <ClockIcon className="w-5 h-5 text-gray-100" />
                                )}

                                {selectedIssue.status == STATUS.VOTING && participant_vote && (
                                  <CheckIcon className="w-5 h-5 text-white" />
                                )}

                                {(selectedIssue.status == STATUS.VOTED || selectedIssue.status == STATUS.FINISHED) &&
                                  participant_vote && <span className="font-medium">{participant_vote}</span>}

                                {(selectedIssue.status == STATUS.VOTED || selectedIssue.status == STATUS.FINISHED) &&
                                  !participant_vote && <ClockIcon className="w-5 h-5 text-gray-100" />}
                              </div>
                            )}
                          </div>
                        </li>
                      );
                    })}
                </ul>
              )}
            </div>
            <div className="w-full h-2/5 border-t border-gray-200">
              {selectedIssue && (
                <>
                  <p className="font-medium pt-5 pb-2 px-5 text-lg">Results</p>
                  {(selectedIssue.status == STATUS.VOTED || selectedIssue.status == STATUS.FINISHED) && (
                    <div className="w-full px-5">
                      <div className="w-full flex items-center mb-2">
                        <div className="w-8/12 text-gray-600">Total votes</div>
                        <div className="w-4/12 flex flex-row-reverse font-medium">
                          <span>&ensp;points</span>
                          <span className="text-purple-500">5</span>
                        </div>
                      </div>
                      <div className="w-full flex items-center mb-2">
                        <div className="w-8/12 text-gray-600">Average vote</div>
                        <div className="w-4/12 flex flex-row-reverse font-medium">
                          <span>&ensp;points</span>
                          <span className="text-purple-500">3.5</span>
                        </div>
                      </div>
                      <div className="w-full flex items-center mb-2">
                        <div className="w-8/12 text-gray-600">Highest vote</div>
                        <div className="w-4/12 flex flex-row-reverse font-medium">
                          <span>&ensp;points</span>
                          <span className="text-purple-500">8</span>
                        </div>
                      </div>
                      <div className="w-full flex items-center mb-2">
                        <div className="w-8/12 text-gray-600">Lowest vote</div>
                        <div className="w-4/12 flex flex-row-reverse font-medium">
                          <span>&ensp;points</span>
                          <span className="text-purple-500">1</span>
                        </div>
                      </div>
                      <div className="w-full flex items-center mb-2">
                        <div className="w-8/12 text-gray-600">Mean</div>
                        <div className="w-4/12 flex flex-row-reverse font-medium">
                          <span>&ensp;points</span>
                          <span className="text-purple-500">3</span>
                        </div>
                      </div>
                    </div>
                  )}
                  {!(selectedIssue.status == STATUS.VOTED || selectedIssue.status == STATUS.FINISHED) && (
                    <p className="mt-2 text-gray-500 px-5">Waiting for voting to be completed</p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
