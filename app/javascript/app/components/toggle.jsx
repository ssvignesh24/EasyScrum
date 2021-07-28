/** @format */

import PropTypes from "prop-types";
import React, { useState } from "react";
import { Switch } from "@headlessui/react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Toggle({ labelText, onChange, state, toggleFront, description, disabled }) {
  const [currentState, setCurrentState] = useState(state);

  const setState = (value) => {
    if (disabled) return;
    setCurrentState(value);
    onChange(value);
  };
  return (
    <Switch.Group>
      {toggleFront && (
        <div className={"flex mt-3 " + (disabled ? "opacity-50" : "")}>
          <Switch
            checked={currentState}
            onChange={(value) => setState(value)}
            className={`${
              currentState ? "bg-green-500" : "bg-gray-200"
            } relative  inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-offset-2 focus:ring-green-500 flex-none ${
              disabled ? "cursor-not-allowed focus:ring-0" : "focus:ring-2"
            }`}>
            <span
              className={`${
                currentState ? "translate-x-6" : "translate-x-1"
              } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
            />
          </Switch>
          <Switch.Label className="ml-4">
            <div className={!!description ? "-mt-1" : undefined}>
              {labelText} {description && <div className="text-gray-500 text-sm"> {description} </div>}
            </div>
          </Switch.Label>
        </div>
      )}
      {!toggleFront && (
        <div className={"flex justify-between mt-3 " + (disabled ? "opacity-50" : "")}>
          <Switch.Label className="mr-4">
            <div className={!!description ? "-mt-1" : undefined}>
              {labelText} {description && <div className="text-gray-500 text-sm"> {description} </div>}
            </div>
          </Switch.Label>
          <Switch
            checked={currentState}
            onChange={(value) => setState(value)}
            className={`${
              currentState ? "bg-green-500" : "bg-gray-200"
            } relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-offset-2 focus:ring-green-500 flex-none ${
              disabled ? "cursor-not-allowed focus:ring-0" : "focus:ring-2"
            }`}>
            <span
              className={`${
                currentState ? "translate-x-6" : "translate-x-1"
              } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
            />
          </Switch>
        </div>
      )}
    </Switch.Group>
  );
}

Toggle.propTypes = {
  onChange: PropTypes.func.isRequired,
  labelText: PropTypes.string.isRequired,
  state: PropTypes.bool,
  toggleFront: PropTypes.bool,
  description: PropTypes.string,
  disabled: PropTypes.bool,
};

Toggle.defaultProps = {
  toggleFront: false,
  state: false,
  disabled: false,
};
export default Toggle;
