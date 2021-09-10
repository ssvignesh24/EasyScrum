/** @format */

import React, { useContext, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import CurrentResourceContext from "../../contexts/current_resource";
import { Primary as PrimaryButton } from "../../components/button";
import { Link } from "@reach/router";
import pluralize from "pluralize";

import EmptyPic from "images/empty.png";
import to_sentence from "../../lib/to_sentence";
import CheckinClient from "../../services/checkin";
import _ from "lodash";

export default function () {
  const checkinClient = new CheckinClient();
  const currentResource = useContext(CurrentResourceContext);

  const [data, setData] = useState({
    checkins: [],
    state: "loading",
    totalCount: 0,
  });

  useEffect(() => {
    checkinClient
      .list()
      .then(({ data }) => {
        if (!data.status) return;
        setData({ state: "loaded", checkins: data.checkins, totalCount: data.totalCount });
      })
      .catch((r) =>
        checkinClient.handleError(r, () => {
          setData({ checkins: [], state: "error", totalCount: 0 });
        })
      );
    return () => checkinClient.cancel();
  }, []);

  return (
    <div className="container mx-auto">
      <div className="w-full mx-auto">
        <div className="py-3 px-3 flex">
          <div className="w-8/12 flex flex-col justify-center">
            <p className="text-xl font-medium">Checkins</p>
            {data.state == "loaded" && <p className="text-gray-500">{pluralize("checkin", data.totalCount, true)}</p>}
            {data.state == "loading" && <p className="text-gray-500">Loading checkins...</p>}
          </div>
          <div className="w-5/12 flex flex-row-reverse items-center">
            {currentResource.type == "User" && (
              <div>
                <Link to="/checkin/create">
                  <PrimaryButton>Create a checkin</PrimaryButton>
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="py-3 px-3">
          {data.state == "loaded" &&
            data.checkins.length > 0 &&
            data.checkins.map((checkin) => {
              return (
                <div key={checkin.id} className="w-full p-4 bg-white shadow rounded mb-3">
                  <Link
                    to={
                      checkin.lastIssueId
                        ? `/checkin/${checkin.id}/issue/${checkin.lastIssueId}`
                        : `/checkin/${checkin.id}`
                    }>
                    <p className="font-medium text-green-500">{checkin.title}</p>
                  </Link>
                  <div className="w-full flex text-sm text-gray-500 items-center">
                    {checkin.paused && (
                      <>
                        <div className="text-red-500">Paused</div>
                        <div className="mx-2 w-1 h-1 rounded-full bg-gray-500"> </div>
                      </>
                    )}
                    <div>{pluralize("Participant", checkin.participantCount, true)}</div>
                    <div className="mx-2 w-1 h-1 rounded-full bg-gray-500"> </div>
                    <div>
                      Every {to_sentence(checkin.days)} at {checkin.time}
                    </div>
                  </div>
                </div>
              );
            })}
          {data.state == "loaded" && data.checkins.length == 0 && (
            <div className="w-full py-20 flex items-center flex-col">
              <img src={EmptyPic} style={{ width: "400px" }} />
              <p className="mt-10 text-lg">No checkins found</p>
            </div>
          )}
          {data.state == "loading" && (
            <>
              {_.times(5, (n) => {
                return (
                  <div className="w-full p-4 bg-white shadow rounded mb-3 " key={n}>
                    <div className="w-80 h-3 bg-gray-200 rounded-lg mb-5 animate-pulse"></div>
                    <div className="flex items-center animate-pulse">
                      <div className="w-32 h-2 bg-gray-200 rounded"></div>
                      <div className="mx-2 w-1 h-1 rounded-full bg-gray-200"> </div>
                      <div className="w-56 h-2 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
