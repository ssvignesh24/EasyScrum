/** @format */

import React, { Fragment, useEffect, useReducer, useState } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { DotsVerticalIcon } from "@heroicons/react/solid";
import { Menu, Transition } from "@headlessui/react";
import { Scrollbars } from "react-custom-scrollbars";

import CreateCard from "./create_card";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ({ children }) {
  return (
    <>
      <div className="h-full p-3 inline-block whitespace-normal" style={{ width: "400px" }}>
        <div className="w-full h-full">
          <div className="w-full mb-3 flex">
            <div className="w-11/12">
              <h3 className="font-bold text-lg">What went well?</h3>
              <p className="text-gray-500 text-sm">4 Cards</p>
            </div>
            <div className="w-1/12 flex items-center h-full flex-row-reverse">
              <Menu as="div" className="relative z-30">
                {({ open }) => (
                  <>
                    <Menu.Button>
                      <DotsVerticalIcon className="w-5 h-5 text-gray-500"></DotsVerticalIcon>
                    </Menu.Button>

                    <Transition
                      show={open}
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95">
                      <Menu.Items
                        static
                        className="origin-top-right absolute right-0 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                className={classNames(
                                  active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                                  "block w-full text-left px-4 py-2 text-sm"
                                )}>
                                Edit column
                              </button>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                className={classNames(
                                  active ? "bg-red-100 text-gray-900" : "text-gray-700",
                                  "block w-full text-left px-4 py-2 text-sm"
                                )}>
                                Remove column
                              </button>
                            )}
                          </Menu.Item>
                        </div>
                      </Menu.Items>
                    </Transition>
                  </>
                )}
              </Menu>
            </div>
          </div>
          <div className="w-full overflow-hidden relative z-20" style={{ height: "calc(100% - 60px)" }}>
            <Scrollbars autoHide autoHideTimeout={1000}>
              <div className="w-full">
                <CreateCard />
              </div>
              {children}
            </Scrollbars>
          </div>
        </div>
      </div>
    </>
  );
}
