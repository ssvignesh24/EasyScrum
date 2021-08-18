/** @format */

import React, { useContext, useEffect, useReducer, useState } from "react";
import ReactDOM from "react-dom";
import pluralize from "pluralize";
import { Link } from "@reach/router";
import truncate from "../../lib/truncate";

import { Primary as PrimaryButton } from "../../components/button";
import CreateBoard from "./modals/create_board";
import EmptyData from "images/empty.png";
import Poker from "../../services/poker";
import CurrentResourceContext from "../../contexts/current_resource";

export default function ({ children }) {
  const pokerClient = new Poker();
  const currentResource = useContext(CurrentResourceContext);

  const [showCreateBoard, setShowCreateBoard] = useState(false);
  const [data, setData] = useState({
    boards: [],
    state: "loading",
    totalCount: 2,
  });

  useEffect(() => {
    pokerClient
      .list()
      .then(({ data }) => {
        if (!data.status) return;
        data.state = "loaded";
        setData(data);
        mixpanel?.track("Poker: Board list");
      })
      .catch((r) =>
        pokerClient.handleError(r, () => {
          setData({ boards: [], state: "error", totalCount: 0 });
        })
      );
    return () => pokerClient.cancel();
  }, []);

  const prependBoard = ({ board }) => {
    if (!board) return;
    const boards = [board].concat(data.boards);
    mixpanel?.track("Poker: Board created", { boardId: board.id });
    setData((data_) => {
      return {
        ...data_,
        boards: boards,
        totalCount: data.totalCount + 1,
      };
    });
  };

  return (
    <>
      {currentResource.type == "User" && data.state == "loaded" && (
        <CreateBoard
          cardTemplates={data.cardTemplates}
          open={showCreateBoard}
          setOpen={setShowCreateBoard}
          afterCreate={prependBoard}
        />
      )}

      <div className="container mx-auto">
        <div className="w-full">
          <div className="py-3 px-3 flex">
            <div className="w-8/12 flex flex-col justify-center">
              <p className="text-xl font-medium">Planning poker</p>
              {data.state == "loaded" && <p className="text-gray-500">{pluralize("board", data.totalCount, true)}</p>}
              {data.state == "loading" && <p className="text-gray-500">Loading boards...</p>}
            </div>
            <div className="w-5/12 flex flex-row-reverse items-center">
              {currentResource.type == "User" && (
                <div>
                  <PrimaryButton onClick={() => setShowCreateBoard(true)}>Create a board</PrimaryButton>
                </div>
              )}
            </div>
          </div>

          <div className="w-full">
            {data.state == "loaded" && data.boards && (
              <>
                {data.boards.length == 0 && (
                  <>
                    <div className="p-10 mt-10 w-4/12 mx-auto text-center">
                      <img src={EmptyData} alt="No poker board found" className="w-f" />
                      <div className="mt-5">
                        {currentResource.type == "User" && (
                          <>
                            <span className="text-gray-500"> No poker board found, </span>
                            <span
                              className="text-green-500 cursor-pointer hover:underline"
                              onClick={() => setShowCreateBoard(true)}>
                              create one here.
                            </span>
                          </>
                        )}

                        {currentResource.type == "Guest" && (
                          <>
                            <span className="text-gray-500"> No poker board found</span>
                          </>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {data.boards.length > 0 && (
                  <div className="grid grid-cols-2 grid-gap-3">
                    {data.boards.map((board) => {
                      return (
                        <div className="p-3" key={board.id}>
                          <Link to={`/poker/board/${board.id}`}>
                            <div className="p-5 bg-white rounded shadow">
                              <p className="text-lg font-medium">{board.name}</p>
                              <div className="flex text-gray-500 items-center">
                                <span className="text-sm ">{board.createdAt}</span>
                                <div className="middot bg-gray-500"></div>
                                <span className="text-sm">{pluralize("player", board.participantsCount, true)}</span>
                                <div className="middot bg-gray-500"></div>
                                <span className="text-sm">{truncate(board.availableVotesString, 20)}</span>
                              </div>
                            </div>
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
            {data.state == "loading" && (
              <div className="grid grid-cols-2 grid-gap-3">
                {_.times(6, (n) => {
                  return (
                    <div className="p-3" key={n}>
                      <div className="p-5 bg-white rounded shadow">
                        <div className="w-10/12 h-3 mb-3.5 bg-gray-200 rounded-xl animate-pulse"></div>
                        <div className="w-9/12 h-2 bg-gray-200 rounded-xl animate-pulse"></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
