/** @format */

import PropTypes from "prop-types";
import React, { useState } from "react";
import Checkbox from "./checkbox";
import SelectBox from "./select_box";
import InputField from "./input_fields";
import { Dropdown, Rating, Checklist } from "./checkin_fields";

function Question({ prompt, answerType, onChange, isMandatory, placeholder, description, options, defaultAnswer }) {
  const [answer, setAnswer] = useState(defaultAnswer || "");

  return (
    <>
      <p className="font-medium mb-2">
        {prompt}
        {isMandatory && <span className="text-red-500">*</span>}
      </p>
      {answerType == "text" && (
        <InputField.Text
          className="w-full bg-white border border-gray-400 w-full rounded p-3 outline-none focus:border-green-500"
          placeholder={placeholder}
          type="text"
          defaultValue={answer}
          onChange={(value) => {
            setAnswer(value);
            onChange(value);
          }}></InputField.Text>
      )}
      {answerType == "number" && (
        <InputField.Text
          className="w-full bg-white border border-gray-400 w-full rounded p-3 outline-none focus:border-green-500"
          placeholder={placeholder}
          type="number"
          value={answer}
          onChange={(value) => {
            setAnswer(value);
            onChange(value);
          }}></InputField.Text>
      )}
      {answerType == "datetime" && (
        <InputField.Text
          className="w-full bg-white border border-gray-400 w-full rounded p-3 outline-none focus:border-green-500"
          type="datetime-local"
          defaultValue={answer}
          onChange={(value) => {
            setAnswer(value);
            onChange(value);
          }}></InputField.Text>
      )}
      {answerType == "date" && (
        <InputField.Text
          className="w-full bg-white border border-gray-400 w-full rounded p-3 outline-none focus:border-green-500"
          type="date"
          defaultValue={answer}
          onChange={(value) => {
            setAnswer(value);
            onChange(value);
          }}></InputField.Text>
      )}
      {answerType == "time" && (
        <InputField.Text
          className="w-full bg-white border border-gray-400 w-full rounded p-3 outline-none focus:border-green-500"
          type="time"
          defaultValue={answer}
          onChange={(value) => {
            setAnswer(value);
            onChange(value);
          }}></InputField.Text>
      )}
      {answerType == "dropdown" && <Dropdown onChange={onChange} options={options}></Dropdown>}
      {answerType == "rating5" && <Rating maxRating={5} onSelect={onChange}></Rating>}
      {answerType == "rating10" && <Rating maxRating={10} onSelect={onChange}></Rating>}
      {answerType == "checklist" && <Checklist options={options} onChange={onChange}></Checklist>}

      <p className="text-sm text-gray-500 mt-1"> {description} </p>
    </>
  );
}

Question.propTypes = {
  prompt: PropTypes.string.isRequired,
  answerType: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  description: PropTypes.string,
  isMandatory: PropTypes.bool,
  placeholder: PropTypes.string,
  options: PropTypes.any,
  defaultAnswer: PropTypes.string,
};

Question.defaultProps = {
  isMandatory: false,
};

export default Question;
