/** @format */

import React, { Fragment, useState, useRef, useContext, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import PropTypes from "prop-types";
import Input from "../components/input_fields";

import UserClient from "../services/user";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

import { Primary as PrimaryButton, Muted as MutedButton } from "../components/button";

function ProfileModal(props) {
  const nameField = useRef();
  const { currentResource } = props;
  const userClient = new UserClient(currentResource.id);

  const [state, setState] = useState("init");
  const [name, setName] = useState(currentResource.name);
  const [email, setEmail] = useState(currentResource.email);
  const [dp, setDp] = useState();
  const [error, setError] = useState(false);

  useEffect(() => () => userClient.cancel(), []);

  const update = () => {
    setError(false);
    const payload = new FormData();
    const csrf = document.querySelector("meta[name='csrf-token']").getAttribute("content");
    payload.append("authenticity_token", csrf);
    if (!!dp) payload.append("user[display_picture]", dp);
    payload.append("user[name]", name);
    payload.append("user[email]", email);
    userClient
      .updateProfile(payload)
      .then(({ data }) => {
        if (!data.status) return;
        props.afterUpdate(data.user);
        closeModal();
      })
      .catch((r) =>
        userClient.handleError(r, ({ response }) => {
          if (response.data?.errors?.error) setError(response.data?.errors?.error);
        })
      );
  };

  const closeModal = () => {
    props.setOpen(false);
    setState("init");
    setError(false);
  };

  return (
    <Transition.Root show={props.open} as={Fragment}>
      <Dialog
        as="div"
        static
        className="fixed z-40 inset-0 overflow-y-auto"
        initialFocus={nameField}
        open={props.open}
        onClose={props.setOpen}>
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0">
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
            <div className="inline-block align-bottom bg-white rounded-lg text-left shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 rounded-t-lg">
                <div className="">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left">
                    <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                      Edit profile
                    </Dialog.Title>
                    {error && (
                      <div className="w-full rounded border border-red-300 bg-red-100 text-center p-3 mt-3">
                        <p>{error}</p>
                      </div>
                    )}
                    <p className="mb-1 mt-3">Name</p>
                    <input
                      className="w-full bg-white border border-gray-400 w-full rounded p-3 outline-none"
                      placeholder="Eg. John Smith"
                      value={name}
                      ref={nameField}
                      onChange={(event) => setName(event.target.value)}
                    />

                    <p className="mb-1 mt-3">Email</p>
                    <input
                      className="w-full bg-white border border-gray-400 w-full rounded p-3 outline-none"
                      placeholder="Eg. john@easyscrum.com"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                    />
                    <div className="mt-3">
                      <Input.File labelText="Change profile picture" onChange={(file) => setDp(file)} showName={true} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-4 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
                <PrimaryButton
                  onClick={update}
                  disabled={
                    email.split("@").length != 2 || email.trim() == "" || name.trim() == "" || state == "updating"
                  }>
                  {state == "updating" ? "Updating..." : "Update"}
                </PrimaryButton>
                <MutedButton className="mr-3" onClick={() => closeModal()}>
                  Cancel
                </MutedButton>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

ProfileModal.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  afterUpdate: PropTypes.func,
  currentResource: PropTypes.object.isRequired,
};

export default ProfileModal;
