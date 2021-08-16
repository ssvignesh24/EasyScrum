/** @format */

import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Link } from "@reach/router";
import { ChevronRightIcon } from "@heroicons/react/solid";
import UserClient from "../../../services/power/users";
import pluralize from "pluralize";

export default function ({ userId }) {
  const userClient = new UserClient();

  const [state, setState] = useState("loading");
  const [user, setUser] = useState();

  useEffect(() => {
    userClient
      .show(userId)
      .then(({ data }) => {
        if (!data.status) {
          setState("error");
          setUser(false);
        } else {
          setUser(data.user);
          setState("loaded");
        }
      })
      .catch((r) =>
        userClient.handleError(r, () => {
          setState("error");
        })
      );
    return () => userClient.cancel();
  }, []);

  return (
    <div className="w-full h-full">
      <div className="container mx-auto">
        <div className="w-full mx-auto pt-10">
          <div className="flex items-center py-2.5">
            <Link className="text-indigo-500 block" to="/power">
              Manage
            </Link>
            <ChevronRightIcon className="w-5 h-5 text-gray-500 mx-1.5"></ChevronRightIcon> 
            <Link className="text-indigo-500 block" to="/power/users">
              Users
            </Link>
            <ChevronRightIcon className="w-5 h-5 text-gray-500 mx-1.5"></ChevronRightIcon> 
            {state == "loaded" && <span>Vignesh Shanmugasundaram</span>}
            {state == "loading" && <span>...</span>}
          </div>

          {state == "loaded" && (
            <div className="w-full flex mt-4">
              <div className="w-14 h-14 rounded-full flex-shrink-0 overflow-hidden">
                <img className="w-full min-h-full" src={user.avatarUrl} />
              </div>
              <div className="w-full pl-3">
                <p className="font-medium text-xl">{user.name}</p>
                <div className="flex items-center">
                  <div className="text-gray-500">{user.email}</div>
                  <div className="h-1 w-1 bg-gray-500 rounded-full mx-2 5"></div>
                  <div className="text-gray-500">{user.addedOn}</div>
                </div>
              </div>
            </div>
          )}
        </div>
        {state == "loaded" && (
          <div className="w-full mx-auto mt-6">
            <div className="w-full flex">
              <div className="bg-white rounded shadow p-10 flex items-center justify-center mr-5">
                <div className="inline-block">
                  <p className="font-medium text-3xl">{user.guestsCount}</p>
                  <h3 className="text-lg text-gray-500">Guests</h3>
                </div>
              </div>
              <div className="bg-white rounded shadow p-10 flex items-center justify-center mr-5">
                <div className="inline-block">
                  <p className="font-medium text-3xl">{user.retroCount}</p>
                  <h3 className="text-lg text-gray-500">Retrospectives</h3>
                </div>
              </div>
              <div className="bg-white rounded shadow p-10 flex items-center justify-center mr-5">
                <div className="inline-block">
                  <p className="font-medium text-3xl">{user.pokerCount}</p>
                  <h3 className="text-lg text-gray-500">Planning poker boards</h3>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
