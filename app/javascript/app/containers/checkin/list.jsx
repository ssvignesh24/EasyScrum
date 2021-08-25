/** @format */

import React, { useContext, useState } from "react";
import ReactDOM from "react-dom";
import CurrentResourceContext from "../../contexts/current_resource";
import { Primary as PrimaryButton } from "../../components/button";
import { Link } from "@reach/router";

export default function () {
  const currentResource = useContext(CurrentResourceContext);

  const [data, seData] = useState({
    checkins: [],
    state: "loading",
    totalCount: 0,
  });

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
                  <PrimaryButton onClick={() => {}}>Create a checkin</PrimaryButton>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
