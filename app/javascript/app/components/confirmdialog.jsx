/** @format */

import React, { Fragment, useState, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import PropTypes from "prop-types";
import { Primary as PrimaryButton, Muted as MutedButton, Danger as DangerButton } from "./button";

function ConfirmDialog(props) {
  const cancelDelete = useRef();
  const { okText, cancelText, onOk, onCancel, title, body, open, disabled } = props;

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        static
        className="fixed z-50 inset-0 overflow-y-auto"
        initialFocus={cancelDelete}
        open={open}
        onClose={onCancel}>
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
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left">
                    <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                      {title}
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-700">{body}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-4 py-5 sm:px-6 sm:flex sm:flex-row-reverse">
                <DangerButton type="button" className="ml-3" onClick={() => onOk()} disabled={disabled}>
                  {okText}
                </DangerButton>
                {props.cancelText && (
                  <MutedButton type="button" innerRef={cancelDelete} onClick={() => onCancel()}>
                    {cancelText}
                  </MutedButton>
                )}
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

ConfirmDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.any.isRequired,
  body: PropTypes.any.isRequired,
  okText: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired,
  cancelText: PropTypes.string,
  disabled: PropTypes.bool,
};

export default ConfirmDialog;
