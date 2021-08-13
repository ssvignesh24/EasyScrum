/** @format */

import React, { Fragment, useState, useContext, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import PropTypes from "prop-types";
import Input from "../components/input_fields";

import ConfirmDialog from "../components/confirmdialog";

import UserClient from "../services/user";
import CurrentResourceContext from "../contexts/current_resource";

import {
  Primary as PrimaryButton,
  PrimaryLight as PrimaryLightButton,
  DangerLight as DangerLightButton,
  Muted as MutedButton,
} from "../components/button";

function ProfileModal(props) {
  const currentResource = useContext(CurrentResourceContext);
  const nameField = React.createRef();
  const userClient = new UserClient(currentResource.id);
  const { setCurrentResource } = props;

  const [state, setState] = useState("init");
  const [name, setName] = useState(currentResource.name);
  const [email, setEmail] = useState(currentResource.email);
  const [errors, setErrors] = useState({});
  const [currentPassword, setCurrentPassword] = useState();
  const [newPassword, setNewPassword] = useState();
  const [dp, setDp] = useState();
  const [error, setError] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    return () => userClient.cancel();
  }, []);

  const update = () => {
    setError(false);
    setErrors({});
    setState("updating");
    const payload = new FormData();
    const csrf = document.querySelector("meta[name='csrf-token']").getAttribute("content");
    payload.append("authenticity_token", csrf);
    if (!!dp) payload.append("user[display_picture]", dp);
    payload.append("user[name]", name);
    payload.append("user[email]", email);
    if (currentPassword && newPassword) {
      payload.append("user[current_password]", currentPassword);
      payload.append("user[new_password]", newPassword);
    }
    userClient
      .updateProfile(payload)
      .then(({ data }) => {
        if (!data.status) return;
        setState("updated");
        props.afterUpdate(data.user);
        closeModal();
        setCurrentResource((currentResource_) => {
          return { ...currentResource_, name: name, email: email, avatarUrl: data.user.avatarUrl };
        });
      })
      .catch((r) =>
        userClient.handleError(r, ({ response }) => {
          setState("init");
          if (response.data?.errors) setErrors(response.data?.errors);
          if (response.data?.errors?.error) setError(response.data?.errors?.error);
        })
      );
  };

  const closeModal = () => {
    props.setOpen(false);
    setState("init");
    setErrors({});
    setName(currentResource.name);
    setEmail(currentResource.email);
  };

  const confirmProfileDeletion = () => {
    props.setOpen(false);
    setConfirmDelete(true);
  };

  const deleteProfile = () => {
    setState("deleting");
    userClient
      .deleteProfile()
      .then(({ data }) => {
        if (!data.status) return;
        window.location.reload();
      })
      .catch((r) => userClient.handleError(r));
  };

  return (
    <>
      <ConfirmDialog
        open={confirmDelete}
        title="Delete profile?"
        body="You may no longer access this account. All your retrospective and planning poker boards will be lost. Are you sure want to delete your profile?"
        okText={state != "deleting" ? "Yes, delete profile" : "Deleting profile..."}
        disabled={state == "deleting"}
        onCancel={() => {
          setConfirmDelete(false);
          props.setOpen(true);
        }}
        cancelText="Cancel"
        onOk={deleteProfile}
      />
      <Transition.Root show={props.open} as={Fragment}>
        <Dialog
          as="div"
          static
          className="fixed z-40 inset-0 overflow-y-auto"
          initialFocus={nameField}
          open={props.open}
          onClose={closeModal}>
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
                      <Input.Text
                        className="w-full bg-white border border-gray-400 w-full rounded p-3 outline-none"
                        placeholder="Eg. John Smith"
                        defaultValue={name}
                        error={errors.name}
                        onChange={setName}
                      />

                      <p className="mb-1 mt-3">Email</p>
                      <Input.Text
                        className="w-full bg-white border border-gray-400 w-full rounded p-3 outline-none"
                        placeholder="Eg. john@easyscrum.com"
                        defaultValue={email}
                        error={errors.email}
                        onChange={setEmail}
                      />
                      <hr className="mt-5" />
                      <p className="mb-1 mt-3">Current password</p>
                      <Input.Text
                        className="w-full bg-white border border-gray-400 w-full rounded p-3 outline-none"
                        type="password"
                        error={errors.current_password}
                        onChange={setCurrentPassword}
                      />
                      <p className="mb-1 mt-3">New password</p>
                      <Input.Text
                        className="w-full bg-white border border-gray-400 w-full rounded p-3 outline-none"
                        type="password"
                        error={errors.new_password}
                        onChange={setNewPassword}
                      />
                      <hr className="mt-5" />

                      <div className="mt-3" ref={nameField}>
                        <Input.File
                          as={PrimaryLightButton}
                          labelText="Change profile picture"
                          className="w-full"
                          onChange={(file) => setDp(file)}
                          showName={true}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-4 sm:px-6 sm:flex rounded-b-lg">
                  <div className="w-4/12">
                    <DangerLightButton onClick={confirmProfileDeletion}>Delete profile</DangerLightButton>
                  </div>
                  <div className="w-8/12 flex flex-row-reverse">
                    <PrimaryButton
                      onClick={update}
                      disabled={
                        email?.split("@")?.length != 2 || email.trim() == "" || name.trim() == "" || state == "updating"
                      }>
                      {state == "updating" ? "Updating..." : "Update"}
                    </PrimaryButton>
                    <MutedButton className="mr-3" onClick={() => closeModal()}>
                      Cancel
                    </MutedButton>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}

ProfileModal.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  afterUpdate: PropTypes.func,
  setCurrentResource: PropTypes.any.isRequired,
};

export default ProfileModal;
