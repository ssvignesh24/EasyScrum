/** @format */

import React, { Fragment, useState, useContext, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import PropTypes from "prop-types";
import Input from "../components/input_fields";

import UserClient from "../services/user";
import CurrentResourceContext from "../contexts/current_resource";

import { Primary as PrimaryButton, DangerLight as DangerLightButton, Muted as MutedButton } from "../components/button";

function ProfileModal(props) {
  const currentResource = useContext(CurrentResourceContext);
  const nameField = React.createRef();
  const userClient = new UserClient(currentResource.id);

  const [state, setState] = useState("init");
  const [errors, setErrors] = useState({});
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState();

  useEffect(() => {
    return () => userClient.cancel();
  }, []);

  const submit = () => {
    setState("submiting");
    userClient
      .submitFeedback(rating, comment)
      .then(({ data }) => {
        if (!data.status) return;
        setState("submitted");
      })
      .catch((r) =>
        userClient.handleError(r, ({ response }) => {
          setState("init");
          if (response.data?.errors) setErrors(response.data?.errors);
        })
      );
  };

  const closeModal = () => {
    props.setOpen(false);
    setTimeout(() => {
      setState("init");
      setErrors({});
      setComment("");
      setRating(0);
    }, 750);
  };

  return (
    <>
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
                        Feedback
                      </Dialog.Title>
                      {state != "submitted" && (
                        <>
                          {errors && errors.general && (
                            <div className="w-full rounded border border-red-300 bg-red-100 text-center p-3 mt-3">
                              <p>{errors.general}</p>
                            </div>
                          )}
                          <p className="mb-1 mt-3">
                            How likely are you to recommend EasyScrum to your colleagues or network?
                          </p>
                          {errors && errors.rating && (
                            <div className="text-sm text-red-500 my-1">
                              <p>{errors.rating}</p>
                            </div>
                          )}
                          <div className="flex justify-between">
                            {_.times(11, (n) => {
                              if (n == 0) return;
                              return (
                                <div
                                  className={
                                    "w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer " +
                                    (n <= 3 && " hover:bg-red-200 ") +
                                    (n > 3 && n <= 7 && " hover:bg-yellow-200 ") +
                                    (n > 7 && " hover:bg-green-200 ") +
                                    (rating == n && n <= 3 && " bg-red-500 hover:bg-red-500 text-white ") +
                                    (rating == n &&
                                      n > 3 &&
                                      n <= 7 &&
                                      " bg-yellow-500 hover:bg-yellow-500 text-white ") +
                                    (rating == n && n > 7 && " bg-green-500 hover:bg-green-500 text-white ")
                                  }
                                  onClick={() => setRating(n)}
                                  key={n}>
                                  {n}
                                </div>
                              );
                            })}
                          </div>
                          <div className="flex mt-1">
                            <div className="w-6/12">
                              <span className="text-gray-700 text-sm font-medium">Very unlikely</span>
                            </div>
                            <div className="w-6/12 flex flex-row-reverse">
                              <span className="text-gray-700 text-sm font-medium">Very likely</span>
                            </div>
                          </div>

                          <p className="mb-1 mt-3">Comment</p>
                          <Input.TextArea
                            className="w-full bg-white border border-gray-400 w-full rounded p-3 outline-none"
                            placeholder="How can we improve our product?"
                            defaultValue={comment}
                            error={errors.name}
                            onChange={setComment}
                          />
                        </>
                      )}
                      {state == "submitted" && (
                        <div className="py-3">
                          <p className="text-center text-lg">Thank you for your feedback :)</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-4 sm:px-6 sm:flex rounded-b-lg">
                  <div className="w-full flex flex-row-reverse">
                    {state != "submitted" && (
                      <PrimaryButton onClick={submit} disabled={rating <= 0 || !comment || state == "submiting"}>
                        {state == "submiting" ? "Submiting..." : "Submit"}
                      </PrimaryButton>
                    )}

                    <MutedButton className="mr-3" onClick={() => closeModal()}>
                      {state == "submitted" ? "Close" : "Cancel"}
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
};

export default ProfileModal;
