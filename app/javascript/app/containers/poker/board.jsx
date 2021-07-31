/** @format */

import React, { useEffect, Fragment, useState } from "react";
import ReactDOM from "react-dom";
import { Scrollbars } from "react-custom-scrollbars";
import { PlayIcon, PauseIcon, CheckCircleIcon, ChevronDownIcon } from "@heroicons/react/solid";
import { CheckIcon, ClockIcon } from "@heroicons/react/outline";
import pluralize from "pluralize";
import { Link, Redirect } from "@reach/router";
import _ from "lodash";
import { Menu, Transition } from "@headlessui/react";

import ConfirmDialog from "../../components/confirmdialog";
import truncate from "../../lib/truncate";

import Poker from "../../services/poker";
import InviteUsersModal from "../../components/invite_users";
import CreateIssueModal from "./modals/create_issue";
import AssignPointsModal from "./modals/assign_points";
import consumer from "../../lib/action_cable_consumer";

import { Primary as PrimaryButton } from "../../components/button";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const STATUS = {
  ADDED: "added",
  SELECTED: "selected",
  VOTING: "voting",
  VOTED: "voted",
  FINISHED: "finished",
};

const GHOST_ISSUE = {
  SUMMARY: "Ghost issue",
  DESCRIPTION: "Use this issue to vote if you don't want to add issues to the board",
};
export default function ({ children, boardId }) {
  const pokerClient = new Poker(boardId);

  const [showInviteUsersModal, setShowInviteUsersModal] = useState(false);
  const [showAssignPointsModal, setShowAssignPointsModal] = useState(false);
  const [showAddIssueModal, setShowAddIssueModal] = useState(false);
  const [state, setState] = useState("loading");
  const [board, setBoard] = useState();
  const [issues, setIssues] = useState([]);
  const [selectedIssueId, setSelectedIssueId] = useState();
  const [showIssueRemoveConfirmation, setShowIssueRemoveConfirmation] = useState(false);
  const [deletingIssue, setDeletingIssue] = useState();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showConfirmRemoveParticipant, setShowConfirmRemoveParticipant] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState();
  const [deleteState, setDeleteState] = useState("init");
  const [removeParticipantState, setRemoveParticipantState] = useState("init");

  useEffect(() => {
    pokerClient
      .getBoard()
      .then(({ data }) => {
        if (!data.status) return;
        setBoard(data.board);
        setIssues(data.board.issues);
        const si = data.board.issues.find((i) => i.isSelected);
        if (si) setSelectedIssueId(si.id);
        setState("loaded");
      })
      .catch((r) =>
        pokerClient.handleError(r, () => {
          setState("error");
        })
      );
    return () => pokerClient.cancel();
  }, []);

  useEffect(() => {
    if (state != "loaded") return;
    subscribeToBoard();
  }, [state]);

  const currentIssue = () => issues?.find((i) => i.id == selectedIssueId);

  const confirmRemoveParticipant = (participant) => {
    if (board.currentParticipantId == participant.id) return;
    setSelectedParticipant(participant);
    setShowConfirmRemoveParticipant(true);
  };

  const removeParticipant = () => {
    if (!selectedParticipant?.id) return;
    setRemoveParticipantState("removing");
    setBoard((board_) => {
      return {
        ...board_,
        participants: board_.participants.filter((p) => p.id != selectedParticipant.id),
      };
    });
    pokerClient
      .removeParticipant(selectedParticipant?.id)
      .then(({ data }) => {
        if (!data.status) return;
        setShowConfirmRemoveParticipant(false);
        setTimeout(() => {
          setSelectedParticipant(false);
          setRemoveParticipantState("init");
        }, 500);
      })
      .catch((r) => pokerClient.handleError(r));
  };
  const deleteBoard = () => {
    setDeleteState("deleting");
    pokerClient
      .deleteBoard()
      .then(({ data }) => {
        if (!data.status) return;
        setTimeout(() => setDeleteState("deleted"), 1000);
      })
      .catch((r) => pokerClient.handleError(r));
  };

  const modifyBoard = (type, issue) => {
    switch (type) {
      case "add_issue":
        setIssues((issues_) => [issue].concat(issues_));
        break;
      case "remove_issue":
        if (selectedIssueId == issue) setSelectedIssueId(false);
        setIssues((issues_) => issues_.filter((i) => i.id != issue));
        break;
      default:
        break;
    }
  };

  const updateIssue = (type, { issueId, issueStatus, isSelected }) => {
    switch (type) {
      case "update_status":
        if (isSelected) setSelectedIssueId(issueId);
        setIssues((issues) =>
          issues.map((i) => {
            if (i.id == issueId) {
              i.isSelected = isSelected;
              i.status = issueStatus;
            }
            return i;
          })
        );
        break;

      default:
        break;
    }
  };

  const subscribeToBoard = () => {
    consumer.subscriptions.create(
      { channel: "PokerBoardChannel", board_id: board.id },
      {
        received(data) {
          const { status, originParticipantId } = data;
          console.log(data);
          if (!status) return;
          switch (data.type) {
            case "add_issue":
              if (originParticipantId == board.currentParticipantId) return;
              modifyBoard("add_issue", data.issue);
              break;
            case "remove_issue":
              if (originParticipantId == board.currentParticipantId) return;
              modifyBoard("remove_issue", data.issueId);
              break;
            case "update_status":
              if (originParticipantId == board.currentParticipantId) return;
              updateIssue("update_status", data);
              break;
            case "vote":
              addVote(data.issueId, data.participantId, data.vote, data.voteId);
              break;
            case "clear_votes":
              if (originParticipantId == board.currentParticipantId) return;
              clearVotes(data.issueId, false);
              break;
            case "assign_story_points":
              if (originParticipantId == board.currentParticipantId) return;
              updateIssueStatus(data.issueId, data.issueStatus);
              updateIssuePoints(data.issueId, data.finalStoryPoint);
              break;
            case "new_participant":
              addParticipant(data.participant);
              break;
            case "remove_participant":
              setBoard((board_) => {
                return {
                  ...board_,
                  participants: board_.participants.filter((p) => p.id != data.participantId),
                };
              });
              break;
            default:
              break;
          }
        },
      }
    );
  };

  const addParticipant = (participant) => {
    if (board.participants.find((p) => p.id == participant.id)) return;
    setBoard((board_) => {
      return {
        ...board_,
        participants: board_.participants.concat(participant),
      };
    });
  };

  const startVoting = () => {
    setIssues((issues_) =>
      issues_.map((i) => {
        if (i.id == selectedIssueId) {
          i.status = STATUS.VOTING;
        }
        return i;
      })
    );
    pokerClient
      .updateIssueStatus(selectedIssueId, STATUS.VOTING)
      .then(({ data }) => {
        if (!data.status) return;
      })
      .catch((r) => pokerClient.handleError(r));
  };

  const updateIssuePoints = (issueId, points) => {
    setIssues((issues_) =>
      issues_.map((i) => {
        if (i.id == issueId) i.votes.finalStoryPoint = points;
        return i;
      })
    );
  };

  const updateIssueStatus = (issueId, status) => {
    setIssues((issues_) =>
      issues_.map((i) => {
        if (i.id == issueId) i.status = status;
        return i;
      })
    );
  };

  const clearVotes = (issueId, sendReq = true) => {
    const emptyVotes = {
      finalStoryPoint: null,
      avgStoryPoint: null,
      totalVotes: null,
      currentUserVote: null,
      participant_votes: [],
    };
    setIssues((issues_) =>
      issues_.map((i) => {
        if (i.id == issueId) {
          i.votes = emptyVotes;
          i.status = STATUS.ADDED;
        }
        return i;
      })
    );
    if (sendReq) pokerClient.clearVotes(selectedIssueId).catch((r) => pokerClient.handleError(r));
  };

  const restVotes = () => {
    if (!currentIssue().isGhost) return;
    clearVotes(selectedIssueId);
  };

  const finishVoting = () => {
    // stopCounter();
    setIssues((issues_) =>
      issues_.map((i) => {
        if (i.id == selectedIssueId) i.status = STATUS.VOTED;
        return i;
      })
    );
    pokerClient
      .updateIssueStatus(selectedIssueId, STATUS.VOTED)
      .then(({ data }) => {
        if (!data.status) return;
      })
      .catch((r) => pokerClient.handleError(r));
  };

  const addIssue = (issue) => {
    setIssues((issues_) => [issue].concat(issues_));
  };

  const confirmRemoveIssue = (e, issue) => {
    setDeletingIssue(issue);
    e.stopPropagation();
    setShowIssueRemoveConfirmation(true);
  };

  const removeIssue = () => {
    if (!deletingIssue) return;
    setShowIssueRemoveConfirmation(false);
    if (deletingIssue.id == selectedIssueId) setSelectedIssueId(false);
    setIssues((issues_) => issues_.filter((i) => i.id != deletingIssue.id));
    pokerClient.removeIssue(deletingIssue.id).catch((r) => handleError(r));
  };

  const selectIssue = (issue) => {
    if (!board?.canManageBoard) return;
    setSelectedIssueId(issue.id);
    pokerClient
      .updateIssueStatus(issue.id, "selected")
      .then(({ data }) => {
        if (!data.status) return;
      })
      .catch((r) => pokerClient.handleError(r));
  };

  const vote = (vote) => {
    if (currentIssue().status != "voting") return;
    setIssues((issues_) =>
      issues_.map((i) => {
        if (i.id == selectedIssueId) i.votes.currentUserVote = vote;
        return i;
      })
    );
    pokerClient
      .vote(selectedIssueId, vote)
      .then(({ data }) => {})
      .catch((r) => pokerClient.handleError(r));
  };

  const addVote = (issueId, participantId, vote, id) => {
    setIssues((issues_) =>
      issues_.map((i) => {
        if (i.id == issueId) {
          let found = false;
          i.votes.participant_votes = i.votes.participant_votes.map((v) => {
            if (v.targent_participant_id == participantId) {
              found = true;
              v.vote = vote;
            }
            return v;
          });
          if (!found) {
            i.votes.participant_votes = i.votes.participant_votes || [];
            i.votes.participant_votes = i.votes.participant_votes.concat([
              {
                id: id || -1,
                vote: vote,
                targent_participant_id: participantId,
              },
            ]);
          }
        }
        return i;
      })
    );
  };

  const getVoteOfParticipant = (participant_id) => {
    if (!currentIssue()) return;
    const participant_votes = currentIssue().votes.participant_votes;
    return participant_votes.find((p) => {
      return p.targent_participant_id == participant_id;
    })?.vote;
  };

  const highestVote = () => {
    for (const vote_ of board.availableVotes.concat([]).reverse()) {
      const firstVote = currentIssue().votes.participant_votes.find((v) => v.vote == vote_)?.vote;
      if (firstVote) return firstVote;
    }
    return "";
  };

  const lowestVote = () => {
    for (const vote_ of board.availableVotes) {
      const firstVote = currentIssue().votes.participant_votes.find((v) => v.vote == vote_)?.vote;
      if (firstVote) return firstVote;
    }
    return "";
  };

  const mostVoted = () => {
    let mostVote = [],
      mostVoteCount = 0;
    for (const vote_ of board.availableVotes) {
      const count = currentIssue().votes.participant_votes.filter((v) => v.vote == vote_).length || -1;
      if (count > mostVoteCount) {
        mostVote = [vote_];
        mostVoteCount = count;
      } else if (count == mostVoteCount) mostVote.push(vote_);
    }
    return mostVote;
  };

  return (
    <>
      {deleteState == "deleted" && <Redirect to={"/poker"} noThrow />}
      {state == "loaded" && board.canManageBoard && (
        <>
          <ConfirmDialog
            open={confirmDelete}
            title={() => `Delete ${board.name || ""}?`}
            body="Deleting the board will delete all its issues and assgined story points. Are you sure want to delete this board?"
            okText={deleteState == "init" ? "Yes, Delete" : "Deleting board..."}
            disabled={deleteState == "deleting"}
            onCancel={() => {
              setConfirmDelete(false);
            }}
            cancelText="Cancel"
            onOk={deleteBoard}
          />

          <ConfirmDialog
            open={showConfirmRemoveParticipant}
            title={() => `Remove ${selectedParticipant?.name || ""}?`}
            body="He/She may no longer able to vote in this board. Are you sure want to remove?"
            okText={removeParticipantState == "init" ? "Yes, Remove" : `Removing ${selectedParticipant?.name}...`}
            disabled={removeParticipantState == "removing"}
            onCancel={() => {
              setShowConfirmRemoveParticipant(false);
            }}
            cancelText="Cancel"
            onOk={removeParticipant}
          />
        </>
      )}
      {state == "loaded" && currentIssue() && (
        <AssignPointsModal
          board={board}
          issue={currentIssue()}
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
          {state == "loaded" && board && (
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
                  issues?.length > 0 &&
                  issues.map((issue) => {
                    return (
                      <div
                        key={issue.id}
                        className={
                          "w-full p-3 bg-white shadow rounded mb-4 cursor-pointer border-l-4 flex " +
                          (issue.id == selectedIssueId ? "border-green-500" : "border-white")
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
                {state == "loading" && (
                  <>
                    {_.times(4, (m) => {
                      return (
                        <div key={m} className="bg-white p-3 shadow rounded mb-5 ">
                          <div className="w-6/12 h-2.5 mb-3.5 rounded-xl bg-gray-200 animate-pulse"></div>
                          <div className="w-full h-1.5 mb-3 rounded-xl bg-gray-200 animate-pulse"></div>
                          <div className="w-full h-1.5 mb-3 rounded-xl bg-gray-200 animate-pulse"></div>
                          <div className="w-8/12 h-1.5 mb-3 rounded-xl bg-gray-200 animate-pulse"></div>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            </Scrollbars>
          </div>
          <div className="w-6/12 h-full border-r border-gray-200 bg-white shadow">
            <div className="w-full h-3/5">
              <div className="pmx-5 w-full">
                <div
                  className={
                    "p-3 text-black  w-full border-b " +
                    (currentIssue()?.status == STATUS.VOTING
                      ? "bg-green-200 border-green-400"
                      : "bg-purple-200 border-purple-400")
                  }>
                  <p>
                    {state == "loading" && "Loading board data..."}
                    {state == "loaded" &&
                      !currentIssue() &&
                      board?.canManageBoard &&
                      "Please select an issue to start voting"}
                    {state == "loaded" &&
                      !currentIssue() &&
                      !board?.canManageBoard &&
                      "Waiting for the facilitator to select an issue"}
                    {state == "loaded" && currentIssue() && (
                      <>
                        {board?.canManageBoard && (
                          <>
                            {currentIssue().status == STATUS.ADDED && "Click 'Start voting' to begin voting"}
                            {currentIssue().status == STATUS.VOTING &&
                              "Voting in progress. Click 'Finish voting' after all participants voted to view results"}
                            {currentIssue().status == STATUS.VOTED && !currentIssue().isGhost && "Click 'Next issue'"}
                            {currentIssue().status == STATUS.VOTED &&
                              currentIssue().isGhost &&
                              "Click 'Reset votes' to begin voting again"}
                            {currentIssue().status == STATUS.FINISHED &&
                              "You have assigned points to this issue. Please click next issue to start voting"}
                          </>
                        )}
                        {!board?.canManageBoard && (
                          <>
                            {currentIssue().status == STATUS.ADDED && "Waiting for the facilitator to begin voting"}
                            {currentIssue().status == STATUS.VOTING && "You can cast your vote for this issue now"}
                            {currentIssue().status == STATUS.VOTED &&
                              "Waiting for the facilitator to select the next issue"}
                            {currentIssue().status == STATUS.FINISHED &&
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
                {state == "loaded" && currentIssue() && (
                  <div className="w-4/12 flex flex-row-reverse items-center">
                    {board?.canManageBoard && (
                      <div>
                        {!currentIssue().isGhost && currentIssue().status == STATUS.VOTED && (
                          <>
                            <PrimaryButton
                              size="sm"
                              className="text-sm mr-3 flex-grow-0"
                              onClick={() => setShowAssignPointsModal(true)}>
                              <div className="inline-block h-5"></div>
                              <span>Assign story points</span>
                            </PrimaryButton>
                            <PrimaryButton
                              size="sm"
                              className="text-sm mr-3 flex-grow-0"
                              onClick={() => clearVotes(selectedIssueId)}>
                              <div className="inline-block h-5"></div>
                              <span>Clear votes</span>
                            </PrimaryButton>
                          </>
                        )}
                        {!currentIssue().isGhost && currentIssue().status == STATUS.FINISHED && (
                          <PrimaryButton
                            size="sm"
                            className="text-sm mr-3 flex-grow-0"
                            onClick={() => clearVotes(selectedIssueId)}>
                            <div className="inline-block h-5"></div>
                            <span>Clear votes and revote</span>
                          </PrimaryButton>
                        )}
                        {currentIssue().isGhost &&
                          (currentIssue().status == STATUS.VOTED || currentIssue().status == STATUS.FINISHED) && (
                            <PrimaryButton size="sm" className="text-sm mr-3 flex-grow-0" onClick={restVotes}>
                              <div className="inline-block h-5"></div>
                              <span>Reset votes</span>
                            </PrimaryButton>
                          )}
                        {currentIssue().status == STATUS.ADDED && (
                          <PrimaryButton size="sm" className="text-sm mr-3 flex-grow-0" onClick={startVoting}>
                            <PlayIcon className="w-5 h-5 text-white mr-2"></PlayIcon>
                            <span>Start voting</span>
                          </PrimaryButton>
                        )}
                        {(currentIssue().status == STATUS.VOTING || currentIssue().status == "paused") && (
                          <>
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
                {state == "loaded" && !currentIssue() && (
                  <>
                    <div className="w-full h-full flex items-center justify-center">
                      <p className="text-gray-500 px-5 mt-2">No issue selected</p>
                    </div>
                  </>
                )}
                {state == "loaded" && currentIssue() && (
                  <>
                    {!currentIssue().isGhost && (
                      <>
                        <div className="px-5">
                          <p className="pt-2 font-medium">{currentIssue().summary}</p>
                          {currentIssue().link && (
                            <Link to={currentIssue().link} className="text-sm mb-2 text-green-500">
                              View issue
                            </Link>
                          )}
                          <p className="pb-2 mt-1">{currentIssue().description}</p>
                        </div>
                      </>
                    )}
                    {currentIssue().isGhost && (
                      <>
                        <div className="px-5">
                          <p className="pt-2 mb-1 font-medium text-indigo-500">{GHOST_ISSUE.SUMMARY}</p>
                          <p className="pb-2">{GHOST_ISSUE.DESCRIPTION}</p>
                        </div>
                      </>
                    )}
                  </>
                )}
                {state == "loading" && (
                  <div className="px-5">
                    <div className="w-6/12 h-2.5 mb-3.5 rounded-xl bg-gray-200 animate-pulse"></div>
                    <div className="w-full h-2 mb-3 rounded-xl bg-gray-200 animate-pulse"></div>
                    <div className="w-full h-2 mb-3 rounded-xl bg-gray-200 animate-pulse"></div>
                    <div className="w-8/12 h-2 mb-3 rounded-xl bg-gray-200 animate-pulse"></div>
                  </div>
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
                            (currentIssue() && currentIssue().votes.currentUserVote == v
                              ? "bg-green-500 hover:bg-green-500 text-white"
                              : "bg-white") +
                            (currentIssue()?.status != "voting"
                              ? " cursor-not-allowed opacity-60 "
                              : " cursor-normal hover:bg-green-50")
                          }>
                          {v}
                        </div>
                      </div>
                    );
                  })}
                {state == "loading" && (
                  <>
                    {_.times(12, (n) => {
                      return (
                        <div className="p-3 w-32 h-32" key={n}>
                          <div className="animate-pulse shadow border border-gray-200 rounded w-full h-full cursor-pointer transition-colors flex items-center justify-center text-xl font-medium ">
                            <div className="w-0 h-3 bg-gray-300 rounded"></div>
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="w-3/12 h-full bg-white">
            <div className="w-full h-3/5">
              <Scrollbars>
                <p className="font-medium pt-5 pb-2 px-5 text-lg">Players</p>
                {currentIssue() && (
                  <ul>
                    {state == "loaded" &&
                      board.participants?.length > 0 &&
                      board.participants.map((participant) => {
                        const participant_vote = getVoteOfParticipant(participant.id);
                        return (
                          <li
                            className="w-full py-3 px-5 flex items-center hover:bg-gray-100 transition-colors"
                            onClick={() => confirmRemoveParticipant(participant)}
                            key={participant.id}>
                            <div className="w-9/12 h-full flex justify-center flex-col">
                              <p>{participant.name}</p>
                              <p className="text-sm text-gray-500">{participant.email}</p>
                            </div>
                            <div className="w-3/12 h-full flex items-center flex-row-reverse">
                              {currentIssue() && (
                                <div className="h-10 w-10 rounded-full bg-purple-500 text-center flex items-center justify-center text-white">
                                  {currentIssue().status == STATUS.ADDED && (
                                    <ClockIcon className="w-5 h-5 text-gray-100" />
                                  )}

                                  {currentIssue().status == STATUS.VOTING && !participant_vote && (
                                    <ClockIcon className="w-5 h-5 text-gray-100" />
                                  )}

                                  {currentIssue().status == STATUS.VOTING && participant_vote && (
                                    <CheckIcon className="w-5 h-5 text-white" />
                                  )}

                                  {(currentIssue().status == STATUS.VOTED ||
                                    currentIssue().status == STATUS.FINISHED) &&
                                    participant_vote && <span className="font-medium">{participant_vote}</span>}

                                  {(currentIssue().status == STATUS.VOTED ||
                                    currentIssue().status == STATUS.FINISHED) &&
                                    !participant_vote && <ClockIcon className="w-5 h-5 text-gray-100" />}
                                </div>
                              )}
                            </div>
                          </li>
                        );
                      })}
                    {state == "loading" && (
                      <>
                        {_.times(5, (n) => {
                          return (
                            <div className="py-3 px-5 mb-3 w-full">
                              <div class="w-10/12 h-3 mb-2.5 bg-gray-200 rounded animate-pulse"></div>
                              <div class="w-9/12 h-2 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                          );
                        })}
                      </>
                    )}
                  </ul>
                )}
              </Scrollbars>
            </div>
            <div className="w-full h-2/5 border-t border-gray-200">
              {state == "loaded" && currentIssue() && (
                <>
                  <p className="font-medium pt-5 pb-2 px-5 text-lg">Results</p>
                  (currentIssue().status == STATUS.VOTED || currentIssue().status == STATUS.FINISHED) && (
                  <div className="w-full px-5">
                    <div className="w-full flex items-center mb-2">
                      <div className="w-8/12 text-gray-600">Total votes</div>
                      <div className="w-4/12 flex flex-row-reverse font-medium">
                        <span>&ensp;{pluralize("vote", currentIssue().votes.participant_votes || 0)}</span>
                        <span className="text-purple-500">{currentIssue().votes.participant_votes.length || 0}</span>
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
                      <div className="w-8/12 text-gray-600">Most voted</div>
                      <div className="w-4/12 flex flex-row-reverse font-medium">
                        <span>&ensp;points</span>
                        <span className="text-purple-500">{mostVoted().join(", ")}</span>
                      </div>
                    </div>
                  </div>
                  )
                  {state == "loaded" &&
                    !(currentIssue().status == STATUS.VOTED || currentIssue().status == STATUS.FINISHED) && (
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
