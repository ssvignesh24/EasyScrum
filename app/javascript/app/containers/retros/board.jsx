/** @format */

import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

import { Primary as PrimaryButton } from "../../components/button";
import { Column, Card } from "../../components/retro";
import CreateColumnModal from "./modals/create_column";
import InviteUsersModal from "./invite_users";

import Retro from "../../services/retro";
import pluralize from "pluralize";

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
      <InviteUsersModal open={showInviteUsersModal} setOpen={setShowInviteUsersModal} afterInvite={() => {}} />
      <div className="w-full bg-white flex shadow px-5" style={{ height: "80px" }}>
        <div className="w-9/12 h-full flex justify-center flex-col">
          <p className="font-medium text-lg ">{state == "loaded" && board.name}</p>
          <p className="font-medium text-lg ">{state == "loading" && "Loading retrospective..."}</p>
          <p className="text-gray-500 text-sm">
            {state == "loaded" && pluralize("Participants", board.participantsCount, true)}
          </p>
        </div>
        <div className="w-3/12 flex items-center flex-row-reverse">
          <PrimaryButton>Action items</PrimaryButton>
          <PrimaryButton onClick={() => setShowCreateColumn(true)} className="mr-3">
            Add column
          </PrimaryButton>
          <PrimaryButton className="mr-3" onClick={() => setShowInviteUsersModal(true)}>
            Invite users
          </PrimaryButton>
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
