/** @format */

import React, { useEffect, useReducer, useState } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { Scrollbars } from "react-custom-scrollbars";
import { PlayIcon, PauseIcon, CheckCircleIcon } from "@heroicons/react/solid";

import { Primary as PrimaryButton } from "../../components/button";

export default function ({ children }) {
  let timer;
  const [currentIssueState, setCurrentIssueState] = useState("selected");
  const [manualCounterReset, setManualCounterReset] = useState(true);
  const [pauseCounter, setPauseCounter] = useState(false);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    if (manualCounterReset) {
      setManualCounterReset(false);
      return;
    }
    if (timer) clearInterval(timer);
    timer = setTimeout(() => {
      if (pauseCounter) return;
      setCounter(counter + 1);
    }, 1000);
  }, [counter]);

  const startCounter = () => {
    if (counter == 0) setTimeout(() => setCounter(counter + 1), 1000);
    else setTimeout(() => setCounter(0), 1000);
  };

  const stopCounter = () => {
    if (timer) clearInterval(timer);
  };

  const startVoting = () => {
    setCurrentIssueState("voting");
    startCounter();
  };

  const pauseVoting = () => {
    let _pauseCounter = !pauseCounter;
    setPauseCounter(_pauseCounter);
    if (_pauseCounter) {
      setCurrentIssueState("paused");
    } else {
      setCurrentIssueState("voting");
      setTimeout(() => setCounter(counter + 1), 1000);
    }
  };
  const finishVoting = () => {
    stopCounter();
    setCurrentIssueState("finished");
  };

  return (
    <>
      <div className="w-full bg-white flex shadow px-5 z-20 relative" style={{ height: "80px" }}>
        <div className="w-9/12 h-full flex justify-center flex-col">
          <p className="font-medium text-lg ">Poker board</p>
          <p className="text-gray-500 text-sm">5 players</p>
        </div>
        <div className="w-3/12 flex items-center flex-row-reverse">
          <PrimaryButton className="mr-3" onClick={() => setShowInviteUsersModal(true)}>
            Invite users
          </PrimaryButton>
        </div>
      </div>
      <div className="w-full z-10 relative" style={{ height: "calc(100vh - 140px)", overflow: "hidden" }}>
        <div className="w-full h-full flex">
          <div className="w-3/12 h-full">
            <Scrollbars>
              <div className="p-5">
                <p className="text-lg font-medium mb-2">Issues</p>
                <div className="w-full p-3 bg-white shadow rounded mb-4">
                  <p className="text-indigo-500 font-medium">IHS-12345</p>
                  <p>
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Non enim praesentium iusto est ad quia
                    adipisci obcaecati eum fugiat nobis atque minima reprehenderit maxime odio accusantium consequuntur,
                    ea id. Recusandae?
                  </p>
                </div>
                <div className="w-full p-3 bg-white shadow rounded mb-4">
                  <p className="text-indigo-500 font-medium">IHS-12345</p>
                  <p>
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Non enim praesentium iusto est ad quia
                    adipisci obcaecati eum fugiat nobis atque minima reprehenderit maxime odio accusantium consequuntur,
                    ea id. Recusandae?
                  </p>
                </div>
                <div className="w-full p-3 bg-white shadow rounded mb-4">
                  <p className="text-indigo-500 font-medium">IHS-12345</p>
                  <p>
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Non enim praesentium iusto est ad quia
                    adipisci obcaecati eum fugiat nobis atque minima reprehenderit maxime odio accusantium consequuntur,
                    ea id. Recusandae?
                  </p>
                </div>
                <div className="w-full p-3 bg-white shadow rounded mb-4">
                  <p className="text-indigo-500 font-medium">IHS-12345</p>
                  <p>
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Non enim praesentium iusto est ad quia
                    adipisci obcaecati eum fugiat nobis atque minima reprehenderit maxime odio accusantium consequuntur,
                    ea id. Recusandae?
                  </p>
                </div>
                <div className="w-full p-3 bg-white shadow rounded mb-4">
                  <p className="text-indigo-500 font-medium">IHS-12345</p>
                  <p>
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Non enim praesentium iusto est ad quia
                    adipisci obcaecati eum fugiat nobis atque minima reprehenderit maxime odio accusantium consequuntur,
                    ea id. Recusandae?
                  </p>
                </div>
                <div className="w-full p-3 bg-white shadow rounded mb-4">
                  <p className="text-indigo-500 font-medium">IHS-12345</p>
                  <p>
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Non enim praesentium iusto est ad quia
                    adipisci obcaecati eum fugiat nobis atque minima reprehenderit maxime odio accusantium consequuntur,
                    ea id. Recusandae?
                  </p>
                </div>
                <div className="w-full p-3 bg-white shadow rounded mb-4">
                  <p className="text-indigo-500 font-medium">IHS-12345</p>
                  <p>
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Non enim praesentium iusto est ad quia
                    adipisci obcaecati eum fugiat nobis atque minima reprehenderit maxime odio accusantium consequuntur,
                    ea id. Recusandae?
                  </p>
                </div>
              </div>
            </Scrollbars>
          </div>
          <div className="w-6/12 h-full border-r border-gray-200 bg-white shadow">
            <div className="w-full h-3/5">
              <div className="flex h-16">
                <div className="w-8/12 flex items-center">
                  <p className="font-medium px-5 text-lg">Current issue</p>
                </div>
                <div className="w-4/12 flex flex-row-reverse items-center">
                  <div>
                    {(currentIssueState == "selected" || currentIssueState == "finished") && (
                      <PrimaryButton size="sm" className="text-sm mr-3 flex-grow-0" onClick={startVoting}>
                        <div className="inline-block h-5"></div>
                        <span>Next issue</span>
                      </PrimaryButton>
                    )}
                    {currentIssueState == "selected" && (
                      <PrimaryButton size="sm" className="text-sm mr-3 flex-grow-0" onClick={startVoting}>
                        <PlayIcon className="w-5 h-5 text-white mr-2"></PlayIcon>
                        <span>Start voting</span>
                      </PrimaryButton>
                    )}
                    {(currentIssueState == "voting" || currentIssueState == "paused") && (
                      <>
                        <PrimaryButton size="sm" className="text-sm mr-3 flex-grow-0" onClick={pauseVoting}>
                          {currentIssueState == "voting" && <PauseIcon className="w-5 h-5 text-white mr-2"></PauseIcon>}
                          {currentIssueState == "paused" && <PlayIcon className="w-5 h-5 text-white mr-2"></PlayIcon>}
                          {counter}
                        </PrimaryButton>
                        <PrimaryButton size="sm" className="text-sm mr-3 flex-grow-0" onClick={finishVoting}>
                          <CheckCircleIcon className="w-5 h-5 text-white mr-2"></CheckCircleIcon>
                          Finish voting
                        </PrimaryButton>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="w-full">
                <p className="px-5 pt-2 text-indigo-500">IHS-1234</p>
                <p className="px-5 pb-2">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque blanditiis porro molestiae sunt
                  consequuntur est labore, quas numquam expedita. Sed esse labore unde expedita ducimus dolore delectus,
                  voluptatibus culpa doloremque?
                </p>
              </div>
            </div>
            <div className="w-full h-2/5 pb-20 border-t border-gray-200">
              <p className="font-medium text-lg px-5 mb-2 mt-3">Your vote</p>
              <div className="h-full w-full grid grid-cols-5 grid-gap-2 px-3">
                <div className="p-3">
                  <div className="bg-white shadow border border-gray-200 rounded w-full h-full cursor-pointer hover:bg-green-50 transition-colors flex items-center justify-center text-xl font-medium">
                    0.5
                  </div>
                </div>
                <div className="p-3">
                  <div className="bg-white shadow border border-gray-200 rounded w-full h-full cursor-pointer hover:bg-green-50 transition-colors flex items-center justify-center text-xl font-medium">
                    1
                  </div>
                </div>
                <div className="p-3">
                  <div className="bg-white shadow border border-gray-200 rounded w-full h-full cursor-pointer hover:bg-green-50 transition-colors flex items-center justify-center text-xl font-medium">
                    2
                  </div>
                </div>
                <div className="p-3">
                  <div className="bg-white shadow border border-gray-200 rounded w-full h-full cursor-pointer hover:bg-green-50 transition-colors flex items-center justify-center text-xl font-medium">
                    3
                  </div>
                </div>
                <div className="p-3">
                  <div className="bg-white shadow border border-gray-200 rounded w-full h-full cursor-pointer hover:bg-green-50 transition-colors flex items-center justify-center text-xl font-medium">
                    5
                  </div>
                </div>
                <div className="p-3">
                  <div className="bg-white shadow border border-gray-200 rounded w-full h-full cursor-pointer hover:bg-green-50 transition-colors flex items-center justify-center text-xl font-medium">
                    8
                  </div>
                </div>
                <div className="p-3">
                  <div className="bg-white shadow border border-gray-200 rounded w-full h-full cursor-pointer hover:bg-green-50 transition-colors flex items-center justify-center text-xl font-medium">
                    13
                  </div>
                </div>
                <div className="p-3">
                  <div className="bg-white shadow border border-gray-200 rounded w-full h-full cursor-pointer hover:bg-green-50 transition-colors flex items-center justify-center text-xl font-medium">
                    ?
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-3/12 h-full bg-white">
            <p className="font-medium pt-5 pb-2 px-5 text-lg">Players</p>
            <ul>
              <li className="w-full py-3 px-5 flex items-center hover:bg-gray-100 transition-colors">
                <div className="w-9/12 h-full flex items-center">Vignesh Shanmugasundaram</div>
                <div className="w-3/12 h-full flex items-center flex-row-reverse">
                  <div className="h-10 w-10 rounded-full bg-indigo-500 text-center flex items-center justify-center"></div>
                </div>
              </li>
              <li className="w-full py-3 px-5 flex items-center hover:bg-gray-100 transition-colors">
                <div className="w-9/12 h-full flex items-center">Vignesh Shanmugasundaram</div>
                <div className="w-3/12 h-full flex items-center flex-row-reverse">
                  <div className="h-10 w-10 rounded-full bg-indigo-500 text-center flex items-center justify-center"></div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
