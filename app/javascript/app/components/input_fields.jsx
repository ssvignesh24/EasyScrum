/** @format */

import React, { useRef, useState, Fragment, useEffect } from "react";
import PropTypes from "prop-types";

import { Primary as PrimaryButton } from "./button";
const randId = () => {
  return Math.random().toString().slice(5) + "-" + Math.random().toString(36).substring(7);
};

function File({ labelText, onChange, disabled, className, showName }) {
  const [uploadedFile, setUploadedFile] = useState("");
  const field = useRef();

  const handleClick = () => {
    field.current.click();
  };

  const handleFile = (event) => {
    if (event.target.files.length <= 0) return;
    const file = event.target.files[0];
    setUploadedFile(file);
    onChange(file);
  };

  return (
    <>
      <input
        ref={field}
        type="file"
        id={randId()}
        onChange={(event) => handleFile(event)}
        style={{ opacity: 0, position: "fixed", top: "-100%", left: "-100%" }}
      />
      <div className="flex items-center">
        <PrimaryButton className={className} onClick={handleClick} disabled={disabled}>
          {labelText}
        </PrimaryButton>
        {showName && <div className="ml-5">{uploadedFile?.name}</div>}
      </div>
    </>
  );
}

File.propTypes = {
  labelText: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  showName: PropTypes.bool,
};

File.defaultProps = {
  disabled: false,
  className: "",
  showName: false,
};

function TextArea({ defaultValue, onChange, placeholder, disabled, error, listenToChange, className, asRef }) {
  const [value, setValue] = useState(defaultValue || "");

  useEffect(() => {
    if (!listenToChange && listenToChange != "") return;
    setValue(listenToChange);
  }, [listenToChange]);

  const handleChange = (event) => {
    setValue(event.target.value);
    onChange(event.target.value);
  };
  return (
    <>
      <textarea
        className={
          "w-full outline-none p-3 resize-none focus:ring-1 focus:ring-green-500 focus:border-green-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md disabled:bg-gray-100 disabled:opacity-80 disabled:cursor-not-allowed " +
          className
        }
        placeholder={placeholder}
        value={value}
        ref={asRef}
        disabled={disabled}
        onChange={handleChange}></textarea>
      {!!error && <p className="text-sm text-red-500">{error}</p>}
    </>
  );
}

TextArea.propTypes = {
  onChange: PropTypes.func.isRequired,
  defaultValue: PropTypes.string,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  ref: PropTypes.any,
  error: PropTypes.string,
  listenToChange: PropTypes.string,
  className: PropTypes.string,
  asRef: PropTypes.object,
};

TextArea.defaultProps = {
  disabled: false,
  error: "",
  className: "",
};

export default { File, TextArea };
