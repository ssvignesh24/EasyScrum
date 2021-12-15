/** @format */

import React, { Fragment, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import pluralize from "pluralize";

import NoDataImg from "images/nodata.png";
import ErrorImage from "images/error.png";
import CheckinClient from "../../services/checkin";
import { Redirect } from "@reach/router";
import CheckinHeader from "./header";

export default function ({ checkinId }) {
  const checkinClient = new CheckinClient();

  const [state, setState] = useState("loading");
  const [checkin, setCheckin] = useState();

  useEffect(() => {
    checkinClient
      .show(checkinId)
      .then(({ data }) => {
        if (!data.status) {
          setState("error");
          return;
        }
        setCheckin(data.checkin);
        if (data.checkin.issues.length == 0) setState("empty");
        else setState("loaded");
      })
      .catch((r) => checkinClient.handleError(r, () => setState("error")));
    return () => checkinClient.cancel();
  }, []);

  const onPause = (isPaused) => {
    setCheckin({ ...checkin, paused: isPaused });
  };

  const afterDelete = () => {
    setState("deleted");
  };

  return (
    <div className="w-full" style={{ height: "calc(100vh - 60px" }}>
      {state == "deleted" && <Redirect to="/checkin" noThrow />}
      <CheckinHeader checkin={checkin} onPause={onPause} afterDelete={afterDelete}></CheckinHeader>
      {state == "error" && (
        <div className="w-full flex z-28 relative" style={{ height: "calc(100% - 80px)" }}>
          <div className="py-20 w-full">
            <img src={ErrorImage} className="mx-auto" style={{ width: "350px" }} />
            <p className="mt-10 text-center">Something went wrong while loading checkin!</p>
          </div>
        </div>
      )}
      {state == "empty" && (
        <div className="w-full flex z-28 relative items-center justify-center" style={{ height: "calc(100% - 80px)" }}>
          <div className="container mx-auto">
            <div className="mx-auto">
              <img src={NoDataImg} className="w-full mx-auto" style={{ width: "180px" }} />
            </div>
            <p className="text-lg text-gray-700 mt-5 text-center">
              This checkin has not started yet. Please comeback later
            </p>
          </div>
        </div>
      )}
      {state == "loaded" && <Redirect to={`/checkin/${checkin.id}/issue/${checkin.lastIssueId}`} noThrow />}
    </div>
  );
}
