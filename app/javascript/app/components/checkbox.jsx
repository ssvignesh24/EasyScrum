/** @format */

import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

import { CheckIcon } from "@heroicons/react/solid";

const Checkbox = {};

const Group = (props) => {
  const activeStates = props.children
    .map((e) => {
      if (!e) return;
      if (e.props.currentState) return e.props.value || e.props.label;
      else return false;
    })
    .filter((v) => !!v);
  const [state, setState] = useState(activeStates || []);
  const onChange = (label) => {
    let newState = [];
    label = label.trim();
    if (state.indexOf(label) > -1) newState = state.filter((item) => item !== label);
    else newState = state.concat([label]);
    setState(newState);
    props.onChange(newState);
  };

  const updateState = (value) => {
    const newState = state.concat(value);
    setState(newState);
  };

  return props.children.map((element, idx) => {
    if (!element) return;
    return (
      <div className="mb-3" key={idx}>
        <element.type
          {...element.props}
          updateState={updateState}
          onItemClick={() => onChange(element.props.value || element.props.label)}></element.type>
      </div>
    );
  });
};

const Item = (props) => {
  const { label, onItemClick, currentState, disabled, description } = props;
  const [state, setState] = useState(currentState);

  return (
    <div className="w-full relative flex">
      <div
        onClick={() => {
          if (disabled) return;
          let currentState = !state;
          setState(currentState);
          onItemClick(currentState);
        }}
        className={
          "w-6 h-6 flex-none border flex items-center justify-center cursor-pointer mr-1.5 rounded  " +
          (state ? " bg-green-500 border-green-500 text-white" : " border-gray-300 bg-transparent hover:bg-green-50 ") +
          (disabled ? " bg-opacity-50 border-opacity-0 cursor-not-allowed " : " border-opacity-100")
        }>
        {state && <CheckIcon className="h-5 w-5" aria-hidden="true" />}
      </div>
      <div className="flex-grow truncate" title={label}>
        {label}
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
    </div>
  );
};
Checkbox.Group = Group;
Checkbox.Item = Item;

Checkbox.Item.propTypes = {
  label: PropTypes.string.isRequired,
  currentState: PropTypes.bool,
  value: PropTypes.string,
  disabled: PropTypes.bool,
  description: PropTypes.string,
};

Checkbox.Item.defaultProps = {
  currentState: false,
  disabled: false,
  description: "",
};

Checkbox.Group.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default Checkbox;
