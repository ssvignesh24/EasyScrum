/** @format */

import React, { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";

import { Primary as PrimaryButton } from "./button";
const randId = () => {
  return Math.random().toString().slice(5) + "-" + Math.random().toString(36).substring(7);
};

function File(props) {
  const { labelText, onChange, disabled, className, showName, accept, as, maxSize } = props;

  const [uploadedFile, setUploadedFile] = useState("");
  const [error, setError] = useState(false);
  const field = useRef();

  const handleClick = () => {
    field.current.click();
  };

  const handleFile = (event) => {
    setError(false);
    if (event.target.files.length <= 0) return;
    const file = event.target.files[0];
    if (maxSize > -1 && file.size > maxSize) {
      setError("The selected file size is greater than " + maxSize / 1000000 + "MB");
      return;
    }
    setUploadedFile(file);
    onChange(file);
  };

  return (
    <>
      <input
        ref={field}
        type="file"
        accept={accept}
        id={randId()}
        onChange={(event) => handleFile(event)}
        style={{ opacity: 0, position: "fixed", top: "-100%", left: "-100%" }}
      />
      <div className="items-center">
        {React.createElement(as, {
          className: className,
          onClick: handleClick,
          disabled: disabled,
          children: showName && uploadedFile?.name ? `${uploadedFile?.name} - Change image` : labelText,
        })}
        {error && <p className="text-sm mt-1.5 text-red-500 text-center">{error}</p>}
      </div>
    </>
  );
}

File.propTypes = {
  labelText: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  accept: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  showName: PropTypes.bool,
  as: PropTypes.any,
  maxSize: PropTypes.number,
};

File.defaultProps = {
  disabled: false,
  className: "",
  showName: false,
  as: PrimaryButton,
  maxSize: -1,
};

const TextArea = React.forwardRef((props, ref) => {
  const { defaultValue, onChange, placeholder, disabled, error, listenToChange, className } = props;
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
        ref={ref}
        disabled={disabled}
        onChange={handleChange}></textarea>
      {!!error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </>
  );
});

TextArea.propTypes = {
  onChange: PropTypes.func.isRequired,
  defaultValue: PropTypes.string,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
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

const Text = React.forwardRef((props, ref) => {
  const { defaultValue, onChange, placeholder, disabled, error, type, className } = props;
  const [value, setValue] = useState(defaultValue || "");
  const handleChange = (event) => {
    setValue(event.target.value);
    onChange(event.target.value);
  };
  return (
    <>
      <input
        className={
          "w-full outline-none bg-white border border-gray-300 w-full rounded p-3 focus:ring-1 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:opacity-80 disabled:cursor-not-allowed " +
          +className
        }
        placeholder={placeholder}
        value={value}
        ref={ref}
        disabled={disabled}
        type={type}
        onChange={handleChange}
        autoComplete={type == "password" ? "new-password" : "on"}
      />
      {!!error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </>
  );
});

Text.propTypes = {
  onChange: PropTypes.func.isRequired,
  defaultValue: PropTypes.string,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  type: PropTypes.string,
  className: PropTypes.string,
};

Text.defaultProps = {
  disabled: false,
  type: "text",
  error: "",
  className: "",
};

export default { Text, File, TextArea };
