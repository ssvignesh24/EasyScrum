/** @format */

import React, { useEffect, useReducer, useState } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import pluralize from "pluralize";
import { Link } from "@reach/router";
import truncate from "../../lib/truncate";

import { Primary as PrimaryButton } from "../../components/button";
import CreateBoard from "./modals/create_board";

import Poker from "../../services/poker";

export default function ({ children }) {
  const pokerClient = new Poker();

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
    const _data = {
      boards: boards,
      totalCount: data.totalCount + 1,
      state: data.state,
    };
    setData(_data);
  };

  return (
    <>
      <CreateBoard open={showCreateBoard} setOpen={setShowCreateBoard} afterCreate={prependBoard} />
      <div className="container mx-auto">
        <div className="w-full">
          <div className="py-3 px-3 flex">
            <div className="w-8/12 flex flex-col justify-center">
              <p className="text-xl font-medium">Planning poker</p>
              {data.state == "loaded" && <p className="text-gray-500">{pluralize("board", data.totalCount, true)}</p>}
              {data.state == "loading" && <p className="text-gray-500">Loading boards...</p>}
            </div>
            <div className="w-5/12 flex flex-row-reverse items-center">
              <div>
                <PrimaryButton onClick={() => setShowCreateBoard(true)}>Create a board</PrimaryButton>
              </div>
            </div>
          </div>

          <div className="w-full">
            <div className="grid grid-cols-2 grid-gap-3">
              {data.state == "loaded" &&
                data.boards &&
                data.boards.length > 0 &&
                data.boards.map((board) => {
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
              {data.state == "loading" && (
                <>
                  {_.times(6, (n) => {
                    return (
                      <div className="p-3" key={n}>
                        <div className="p-5 bg-white rounded shadow">
                          <div class="w-10/12 h-3 mb-3.5 bg-gray-200 rounded-xl animate-pulse"></div>
                          <div class="w-9/12 h-2 bg-gray-200 rounded-xl animate-pulse"></div>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
