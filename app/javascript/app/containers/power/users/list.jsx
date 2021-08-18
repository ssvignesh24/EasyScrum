/** @format */

import React, { useContext, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Link } from "@reach/router";
import { ChevronRightIcon } from "@heroicons/react/solid";

import DefaultDp from "images/default_dp.jpg";
import UserClient from "../../../services/power/users";
import pluralize from "pluralize";

export default function () {
  const userClient = new UserClient();

  const [userData, setUserData] = useState({
    state: "loading",
    users: [],
    totalCount: 0,
    totalPages: 0,
  });

  useEffect(() => {
    userClient
      .list()
      .then(({ data }) => {
        if (!data.status) {
          setUserData((users) => {
            return { ...users, state: "error" };
          });
        } else {
          setUserData(() => {
            return { state: "loaded", users: data.users, totalCount: data.totalCount };
          });
        }
      })
      .catch((r) =>
        userClient.handleError(r, () => {
          setUserData((users) => {
            return { ...users, state: "erro" };
          });
        })
      );
    return () => userClient.cancel();
  }, []);

  return (
    <>
      <div className="container mx-auto">
        <div className="w-full mx-auto pt-10">
          <div className="flex items-center py-2.5">
            <Link className="text-indigo-500 block" to="/power">
              Manage
            </Link>
            <ChevronRightIcon className="w-5 h-5 text-gray-500 mx-1.5"></ChevronRightIcon> <span>Users</span>
          </div>
          <h1 className="text-2xl font-medium">Users</h1>
          <div className="flex items-center">
            {userData.state == "loading" && <div className="text-gray-500">Loading users...</div>}
            {userData.state == "loaded" && (
              <>
                <div className="text-gray-500">
                  {pluralize("Active user", userData.users.filter((u) => !u.pendingInvitation).length, true)}
                </div>
                <div className="h-1 w-1 bg-gray-500 rounded-full mx-2 5"></div>
                <div className="text-gray-500">
                  {pluralize("Pending user", userData.users.filter((u) => u.pendingInvitation).length, true)}
                </div>
              </>
            )}
          </div>
        </div>
        <div className="w-full mx-auto mt-6">
          {userData.state == "loading" && <p className="text-center">Loading</p>}
          {userData.state == "loaded" && (
            <>
              {userData.users.length > 0 &&
                userData.users.map((user) => {
                  return (
                    <Link to={`/power/users/${user.id}`} key={user.id}>
                      <div className="w-full rounded bg-white shadow p-5 flex mb-3 hover:bg-green-50 transition-colors">
                        <div className="w-12 h-12 rounded-full flex-shrink-0 overflow-hidden">
                          <img className="w-full min-h-full" src={user.avatarUrl || DefaultDp} alt={user.name} />
                        </div>
                        <div className="w-full pl-3">
                          <p className="font-medium">{user.name}</p>
                          <div className="flex items-center text-sm">
                            {user.pendingInvitation && (
                              <>
                                <div className="text-red-500">Invitation pending: Sent at {user.invitationSentAt}</div>
                                <div className="h-1 w-1 bg-gray-500 rounded-full mx-2 5"></div>
                              </>
                            )}

                            <div className="text-gray-500">{user.email}</div>
                            <div className="h-1 w-1 bg-gray-500 rounded-full mx-2 5"></div>
                            {!user.pendingInvitation && (
                              <>
                                <div className="text-gray-500">Last login: {user.lastLoginInHours}</div>
                                <div className="h-1 w-1 bg-gray-500 rounded-full mx-2 5"></div>
                              </>
                            )}
                            <div className="text-gray-500">Created on {user.addedOn}</div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              {userData.users.length == 0 && <p className="text-center">No users</p>}
            </>
          )}
        </div>
      </div>
    </>
  );
}
