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

export default { File };
