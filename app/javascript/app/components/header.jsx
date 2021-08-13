/** @format */

import React, { Fragment, useState, useContext } from "react";
import ReactDOM from "react-dom";
import { Link } from "@reach/router";
import { Menu, Transition } from "@headlessui/react";

import DefaultDp from "images/default_dp.jpg";
import ProfileModal from "../containers/profile_modal";
import CurrentResourceContext from "../contexts/current_resource";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ({ setCurrentResource }) {
  const currentResource = useContext(CurrentResourceContext);
  const csrf_token = document.querySelector("meta[name='csrf-token']").getAttribute("content");

  const [showProfile, setShowProfile] = useState(false);

  const isActive = ({ isCurrent, isPartiallyCurrent }) => {
    let class_name =
      "flex flex-grow-0 items-center px-5 text-white h-full cursor-pointer border-b-4 hover:bg-black hover:bg-opacity-10 ";
    class_name += isPartiallyCurrent ? "border-green-500" : "border-transparent";
    return { className: class_name };
  };

  const updateProfile = ({ name, email, avatarUrl }) => {
    setCurrentResource((re) => {
      return { ...re, name, email, avatarUrl };
    });
  };

  return (
    <>
      {currentResource.type == "User" && (
        <ProfileModal
          open={showProfile}
          setOpen={setShowProfile}
          afterUpdate={updateProfile}
          setCurrentResource={setCurrentResource}
        />
      )}
      <div className="fixed w-full z-40" style={{ top: 0, left: 0, height: "60px", background: "#2e3740" }}>
        <div className="flex h-full">
          <div className="w-8/12 flex">
            <Link to="/dashboard" getProps={isActive}>
              Dashboard
            </Link>
            <Link to="/retro" getProps={isActive}>
              Retrospective
            </Link>
            <Link to="/poker" getProps={isActive}>
              Planning poker
            </Link>
          </div>
          <div className="w-4/12 flex flex-row-reverse">
            {currentResource.type == "User" && (
              <Menu as="div" className="relative flex text-left items-center pr-3">
                {({ open }) => (
                  <>
                    <Menu.Button
                      className="user-menu dropdown cursor-pointer focus:outline-none overflow-hidden w-10 h-10 rounded-full "
                      click="isOpen = !isOpen">
                      <img src={currentResource.avatarUrl || DefaultDp} alt={currentResource.name} />
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
                        className="mt-36 mr-3 origin-top-right absolute right-0 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={() => setShowProfile(true)}
                                className={classNames(
                                  active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                                  "block w-full text-left px-4 py-2 text-sm"
                                )}>
                                Profile
                              </button>
                            )}
                          </Menu.Item>
                          <hr className="my-2" />
                          <form method="POST" action="/users/sign_out">
                            <input type="hidden" name="_method" value="DELETE" />
                            <input type="hidden" name="authenticity_token" value={csrf_token} />
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  type="submit"
                                  className={classNames(
                                    active ? "bg-red-100 text-gray-900" : "text-gray-700",
                                    "block w-full text-left px-4 py-2 text-sm"
                                  )}>
                                  Sign out
                                </button>
                              )}
                            </Menu.Item>
                          </form>
                        </div>
                      </Menu.Items>
                    </Transition>
                  </>
                )}
              </Menu>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
