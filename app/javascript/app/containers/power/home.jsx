/** @format */

import React, { useContext } from "react";
import ReactDOM from "react-dom";
import { Link } from "@reach/router";

import CurrentResourceContext from "../../contexts/current_resource";
import { ArrowNarrowRightIcon } from "@heroicons/react/solid";

export default function ({ children }) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="container mx-auto">
        <div className="w-full mx-auto pt-10">
          <h1 className="text-xl font-medium">Application management</h1>
        </div>
        <div className="w-full mx-auto">
          <div className="flex mt-10">
            <Link className="block w-4/12" to="/power/users">
              <div className="w-full flex p-3 rounded cursor-pointer hover:bg-green-500 hover:bg-opacity-10 transition-colors">
                <div className="w-24 h-24 bg-blue-500 rounded-lg flex-shrink-0 flex items-center justify-center">
                  <svg
                    className="bi bi-people-fill"
                    fill="#fff"
                    height="36"
                    viewBox="0 0 16 16"
                    width="36"
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"></path>
                    <path
                      d="M5.216 14A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216z"
                      fillRule="evenodd"></path>
                    <path d="M4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"></path>
                  </svg>
                </div>
                <div className="pl-3">
                  <div className="font-medium">
                    <div className="inline-block align-middle text-lg">Users</div>
                    <div className="inline-block align-middle ml-1">
                      <ArrowNarrowRightIcon className="w-5 h-5"></ArrowNarrowRightIcon>
                    </div>
                  </div>
                  <p className="text-gray-500">
                    Laborum repudiandae cum repellendus sed nihil veniam eaque quos ea rerum ipsa reprehenderit non!
                  </p>
                </div>
              </div>
            </Link>
            <Link className="block w-4/12" to="/power/features">
              <div className="w-full flex p-3 rounded cursor-pointer hover:bg-green-500 hover:bg-opacity-10 transition-colors">
                <div className="w-24 h-24 bg-blue-500 rounded-lg flex-shrink-0 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="36"
                    height="36"
                    fill="#fff"
                    className="bi bi-flag-fill"
                    viewBox="0 0 16 16">
                    <path d="M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12.435 12.435 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A19.626 19.626 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a19.587 19.587 0 0 0 1.349-.476l.019-.007.004-.002h.001" />
                  </svg>
                </div>
                <div className="pl-3">
                  <div className="font-medium">
                    <div className="inline-block align-middle text-lg">Features</div>
                    <div className="inline-block align-middle ml-1">
                      <ArrowNarrowRightIcon className="w-5 h-5"></ArrowNarrowRightIcon>
                    </div>
                  </div>
                  <p className="text-gray-500">
                    Laborum repudiandae cum repellendus sed nihil veniam eaque quos ea rerum ipsa reprehenderit non!
                  </p>
                </div>
              </div>
            </Link>
            <a className="block w-4/12" href="/power/jobs">
              <div className="w-full flex p-3 rounded cursor-pointer hover:bg-green-500 hover:bg-opacity-10 transition-colors">
                <div className="w-24 h-24 bg-blue-500 rounded-lg flex-shrink-0 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="36"
                    height="36"
                    fill="#fff"
                    className="bi bi-hdd-stack-fill"
                    viewBox="0 0 16 16">
                    <path d="M2 9a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2H2zm.5 3a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm2 0a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zM2 2a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H2zm.5 3a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm2 0a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1z" />
                  </svg>
                </div>
                <div className="pl-3">
                  <div className="font-medium">
                    <div className="inline-block align-middle text-lg">Sidekiq Jobs monitoring</div>
                    <div className="inline-block align-middle ml-1">
                      <ArrowNarrowRightIcon className="w-5 h-5"></ArrowNarrowRightIcon>
                    </div>
                  </div>
                  <p className="text-gray-500">
                    Laborum repudiandae cum repellendus sed nihil veniam eaque quos ea rerum ipsa reprehenderit non!
                  </p>
                </div>
              </div>
            </a>
          </div>
          <div className="flex mt-5">
            <Link className="block w-4/12" to="/power/feedbacks">
              <div className="w-full flex p-3 rounded cursor-pointer hover:bg-green-500 hover:bg-opacity-10 transition-colors">
                <div className="w-24 h-24 bg-blue-500 rounded-lg flex-shrink-0 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="36"
                    height="36"
                    fill="#fff"
                    className="bi bi-chat-dots-fill"
                    viewBox="0 0 16 16">
                    <path d="M16 8c0 3.866-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7zM5 8a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
                  </svg>
                </div>
                <div className="pl-3">
                  <div className="font-medium">
                    <div className="inline-block align-middle text-lg">Feedbacks</div>
                    <div className="inline-block align-middle ml-1">
                      <ArrowNarrowRightIcon className="w-5 h-5"></ArrowNarrowRightIcon>
                    </div>
                  </div>
                  <p className="text-gray-500">
                    Laborum repudiandae cum repellendus sed nihil veniam eaque quos ea rerum ipsa reprehenderit non!
                  </p>
                </div>
              </div>
            </Link>

            <div className="w-4/12 flex p-3 rounded cursor-pointer hover:bg-green-500 hover:bg-opacity-10 transition-colors">
              <div className="w-24 h-24 bg-yellow-500 rounded-lg flex-shrink-0 flex items-center justify-center">
                <svg
                  className="bi bi-suit-club-fill"
                  fill="#fff"
                  height="36"
                  viewBox="0 0 16 16"
                  width="36"
                  xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.5 12.5a3.493 3.493 0 0 1-2.684-1.254 19.92 19.92 0 0 0 1.582 2.907c.231.35-.02.847-.438.847H6.04c-.419 0-.67-.497-.438-.847a19.919 19.919 0 0 0 1.582-2.907 3.5 3.5 0 1 1-2.538-5.743 3.5 3.5 0 1 1 6.708 0A3.5 3.5 0 1 1 11.5 12.5z"></path>
                </svg>
              </div>
              <div className="pl-3">
                <div className="font-medium">
                  <div className="inline-block align-middle">Planning pokers</div>
                  <div className="inline-block align-middle ml-1">
                    <ArrowNarrowRightIcon className="w-5 h-5"></ArrowNarrowRightIcon>
                  </div>
                </div>
                <p className="text-gray-500">
                  Saepe laborum repudiandae cum repellendus sed nihil veniam eaque quos ea rerum ipsa reprehenderitnon!
                </p>
              </div>
            </div>
            <div className="w-4/12 flex p-3 rounded cursor-pointer hover:bg-green-500 hover:bg-opacity-10 transition-colors">
              <div className="w-24 h-24 bg-purple-500 rounded-lg flex-shrink-0 flex items-center justify-center">
                <svg
                  className="bi bi-kanban-fill"
                  fill="#fff"
                  height="36"
                  viewBox="0 0 16 16"
                  width="36"
                  xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.5 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2h-11zm5 2h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zm-5 1a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1V3zm9-1h1a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z"></path>
                </svg>
              </div>
              <div className="pl-3">
                <div className="font-medium">
                  <div className="inline-block align-middle text-lg">Retrospectives</div>
                  <div className="inline-block align-middle ml-1">
                    <ArrowNarrowRightIcon className="w-5 h-5"></ArrowNarrowRightIcon>
                  </div>
                </div>
                <p className="text-gray-500">
                  Laborum repudiandae cum repellendus sed nihil veniam eaque quos ea rerum ipsa reprehenderit non!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
