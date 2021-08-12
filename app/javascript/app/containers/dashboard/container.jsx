/** @format */

import React, { useContext } from "react";
import ReactDOM from "react-dom";
import { Link } from "@reach/router";
import { ArrowNarrowRightIcon, CheckCircleIcon, UserAddIcon } from "@heroicons/react/solid";

import CurrentResourceContext from "../../contexts/current_resource";

export default function ({ children }) {
  const currentResource = useContext(CurrentResourceContext);

  return (
    <div className="w-full h-full flex items-center justify-center pt-20">
      <div className="container mx-auto">
        <div className="w-8/12 mx-auto">
          <h1 className="text-2xl font-medium">Welcome {currentResource.name}</h1>
          <p className="mt-3 text-gray-500">
            Choose anyone option below to start using EasyScrum. You can invite users after creating a retrospective or
            planning poker board.
          </p>
          <div className="flex mt-10">
            {/* <div className="w-6/12 flex p-3 rounded cursor-pointer hover:bg-green-500 hover:bg-opacity-10 transition-colors">
              <div className="w-24 h-24 bg-pink-600 rounded-lg flex-shrink-0 flex items-center justify-center">
                <UserAddIcon className="w-10 h-10 text-white"></UserAddIcon>
              </div>
              <div className="pl-3">
                <div className="font-medium">
                  <div className="inline-block align-middle">Invite users</div>
                  <div className="inline-block align-middle ml-1">
                    <ArrowNarrowRightIcon className="w-5 h-5"></ArrowNarrowRightIcon>
                  </div>
                </div>
                <p className="text-gray-500">
                  Qui asperiores aborum repudiandae cum repellendus sed nihil veniam eaque quos ea rerum ipsa
                  reprehenderit non!
                </p>
              </div>
            </div> */}
            <Link to="/retro" className="block w-6/12">
              <div className="w-full flex p-3 rounded cursor-pointer hover:bg-green-500 hover:bg-opacity-10 transition-colors">
                <div className="w-24 h-24 bg-blue-500 rounded-lg flex-shrink-0 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="36"
                    height="36"
                    fill="#fff"
                    className="bi bi-kanban-fill"
                    viewBox="0 0 16 16">
                    <path d="M2.5 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2h-11zm5 2h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zm-5 1a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1V3zm9-1h1a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z" />
                  </svg>
                </div>
                <div className="pl-3">
                  <div className="font-medium">
                    <div className="inline-block align-middle">Create a retrospective board</div>
                    <div className="inline-block align-middle ml-1">
                      <ArrowNarrowRightIcon className="w-5 h-5"></ArrowNarrowRightIcon>
                    </div>
                  </div>
                  <p className="text-gray-500">
                    Review your team's work and progress in the previous sprint/release. Discuss and create action items
                    to increase your team's success
                  </p>
                </div>
              </div>
            </Link>
            <Link to="/poker" className="block w-6/12">
              <div className="w-full flex p-3 rounded cursor-pointer hover:bg-green-500 hover:bg-opacity-10 transition-colors">
                <div className="w-24 h-24 bg-yellow-500 rounded-lg flex-shrink-0 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="36"
                    height="36"
                    fill="#fff"
                    className="bi bi-suit-club-fill"
                    viewBox="0 0 16 16">
                    <path d="M11.5 12.5a3.493 3.493 0 0 1-2.684-1.254 19.92 19.92 0 0 0 1.582 2.907c.231.35-.02.847-.438.847H6.04c-.419 0-.67-.497-.438-.847a19.919 19.919 0 0 0 1.582-2.907 3.5 3.5 0 1 1-2.538-5.743 3.5 3.5 0 1 1 6.708 0A3.5 3.5 0 1 1 11.5 12.5z" />
                  </svg>
                </div>
                <div className="pl-3">
                  <div className="font-medium">
                    <div className="inline-block align-middle">Create a planning poker board</div>
                    <div className="inline-block align-middle ml-1">
                      <ArrowNarrowRightIcon className="w-5 h-5"></ArrowNarrowRightIcon>
                    </div>
                  </div>
                  <p className="text-gray-500">
                    Discuss about issues/stories for the upcoming sprint/release and estimate story points for issues as
                    a team
                  </p>
                </div>
              </div>
            </Link>
          </div>

          <div className="flex mt-10">
            <div className="w-6/12 flex p-3 rounded cursor-pointer hover:bg-green-500 hover:bg-opacity-10 transition-colors opacity-50">
              <div className="w-24 h-24 bg-green-500 rounded-lg flex-shrink-0 flex items-center justify-center">
                <CheckCircleIcon className="w-10 h-10 text-white"></CheckCircleIcon>
              </div>
              <div className="pl-3">
                <div className="font-medium">
                  <div className="inline-block align-middle">Create a checkin</div>
                  <div className="inline-block align-middle ml-1">
                    <ArrowNarrowRightIcon className="w-5 h-5"></ArrowNarrowRightIcon>
                  </div>
                </div>
                <p className="text-sm text-yellow-700">Coming soon!</p>
                <p className="text-gray-500">
                  Eliminate standup meetings and stay up-to-date with your team's progress and resolve team blockers
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
