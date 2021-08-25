/** @format */

import PropTypes from "prop-types";
import React, { useState } from "react";
import Checkbox from "./checkbox";
import SelectBox from "./select_box";
import InputField from "./input_fields";

function Question({ prompt, answerType, onChange, isMandatory, placeholder, description, options, defaultAnswer }) {
  const [rating5Answer, setRating5Answer] = useState();
  const [answer, setAnswer] = useState(defaultAnswer || "");

  const renderDropdown = () => {
    if (!options || options.length === 0) return <></>;
    if (typeof options == "string") {
      let selectOptions = [{ key: "", name: "Select" }];
      options
        .trim()
        .split(",")
        .map((option) => {
          option = option.trim();
          if (option == "") return;
          if (selectOptions.find((o) => option == o.key)) return;
          selectOptions.push({ key: option, name: option });
        });
      return <SelectBox options={selectOptions} onChange={(value) => onChange(value)} selected={selectOptions[0]} />;
    } else {
      let selectOptions = [{ key: "", name: "Select" }];
      selectOptions = selectOptions.concat(
        options.map((option) => {
          return { key: option, name: option };
        })
      );
      return <SelectBox options={selectOptions} onChange={(value) => onChange(value)} selected={selectOptions[0]} />;
    }
  };

  const renderRating = (maxRating) => {
    return (
      <div className="flex w-full">
        {_.times(maxRating, (n) => {
          let val = n + 1;
          return (
            <div
              className={
                "rounded-full mr-2 flex items-center justify-center cursor-pointer hover:bg-green-100 " +
                (rating5Answer == val ? "bg-green-500 text-white hover:bg-green-500 " : "bg-gray-100 ") +
                (maxRating == 5 ? " w-12 h-12 " : " w-10 h-10 ")
              }
              key={n}
              onClick={() => {
                setRating5Answer(val);
                onChange(val);
              }}>
              {val}
            </div>
          );
        })}
      </div>
    );
  };
  const renderChecklist = () => {
    if (!options || options.length === 0) return <></>;
    let selectOptions = [];
    let key = 0;
    selectOptions =
      typeof options == "string"
        ? options
            .trim()
            .split(",")
            .map((op) => op.trim())
        : options;
    selectOptions = selectOptions.filter((option, index, self) => {
      return self.indexOf(option) === index;
    });
    return (
      <Checkbox.Group onChange={(value) => onChange(value)}>
        {selectOptions.map((option) => {
          option = option.trim();
          if (!option) return;
          return <Checkbox.Item label={option} key={++key} />;
        })}
      </Checkbox.Group>
    );
  };
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
          onChange={(event) => {
            setAnswer(event.target.value);
            onChange(event.target.value);
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
      {answerType == "dropdown" && renderDropdown()}
      {answerType == "rating5" && renderRating(5)}
      {answerType == "rating10" && renderRating(10)}
      {answerType == "checklist" && renderChecklist()}

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
