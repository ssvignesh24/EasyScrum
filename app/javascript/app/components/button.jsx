/** @format */

import React, { useRef, useState, Fragment, useEffect } from "react";
import PropTypes from "prop-types";

const randId = () => {
  return Math.random().toString().slice(5) + "-" + Math.random().toString(36).substring(7);
};

const sizeClasses = (size) => {
  if (size == "md") return "px-4 py-2";
  else if (size == "sm") return "px-2 py-1.5";
};

const commonClasses =
  "inline-flex items-center justify-center rounded-md border border-transparent shadow-sm text-base disabled:opacity-50 focus:outline-none  ";

function Muted({ children, onClick, size, className, disabled }) {
  const handleClick = () => {
    if (!onClick) return;
    onClick();
  };
  return (
    <>
      <button
        onClick={handleClick}
        disabled={disabled}
        className={commonClasses + " border bg-gray-50 border-gray-300 " + sizeClasses(size) + " " + className}>
        {children}
      </button>
    </>
  );
}

Muted.propTypes = {
  onClick: PropTypes.func,
  size: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  as: PropTypes.string,
};

Muted.defaultProps = {
  size: "md",
  className: "",
  disabled: false,
  as: "button",
};

function Primary({ children, onClick, size, className, disabled, as }) {
  const handleClick = () => {
    if (!onClick) return;
    onClick();
  };
  return (
    <>
      {as == "button" && (
        <button
          onClick={handleClick}
          disabled={disabled}
          className={
            commonClasses +
            "bg-green-500 focus:ring-2 focus:ring-offset-2 focus:ring-green-500 text-white " +
            sizeClasses(size) +
            " " +
            className
          }>
          {children}
        </button>
      )}
      {as == "div" && (
        <div
          onClick={handleClick}
          disabled={disabled}
          className={
            commonClasses +
            "bg-green-500 focus:ring-2 focus:ring-offset-2 focus:ring-green-500 text-white " +
            sizeClasses(size) +
            " " +
            className
          }>
          {children}
        </div>
      )}
    </>
  );
}

Primary.propTypes = {
  onClick: PropTypes.func,
  size: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  as: PropTypes.string,
};

Primary.defaultProps = {
  size: "md",
  className: "",
  disabled: false,
  as: "button",
};

function PrimaryLight({ children, onClick, size, className, disabled, as }) {
  const handleClick = () => {
    if (!onClick) return;
    onClick();
  };
  return (
    <>
      {as == "button" && (
        <button
          onClick={handleClick}
          disabled={disabled}
          className={
            commonClasses +
            "bg-green-500 bg-opacity-30 focus:ring-2 focus:ring-offset-2 focus:ring-green-500 text-green-600 " +
            sizeClasses(size) +
            " " +
            className
          }>
          {children}
        </button>
      )}
      {as == "div" && (
        <div
          onClick={handleClick}
          disabled={disabled}
          className={
            commonClasses +
            "bg-green-500 focus:ring-2 focus:ring-offset-2 focus:ring-green-500 text-white " +
            sizeClasses(size) +
            " " +
            className
          }>
          {children}
        </div>
      )}
    </>
  );
}

PrimaryLight.propTypes = {
  onClick: PropTypes.func,
  size: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  as: PropTypes.string,
};

PrimaryLight.defaultProps = {
  size: "md",
  className: "",
  disabled: false,
  as: "button",
};

function Danger({ children, onClick, size, className, disabled, as }) {
  const handleClick = () => {
    if (!onClick) return;
    onClick();
  };
  return (
    <>
      {as == "button" && (
        <button
          onClick={handleClick}
          disabled={disabled}
          className={
            commonClasses +
            "bg-red-500 focus:ring-2 focus:ring-offset-2 focus:ring-red-500 text-white " +
            sizeClasses(size) +
            " " +
            className
          }>
          {children}
        </button>
      )}
      {as == "div" && (
        <div
          onClick={handleClick}
          disabled={disabled}
          className={
            commonClasses +
            "bg-red-500 focus:ring-2 focus:ring-offset-2 focus:ring-red-500 text-white " +
            sizeClasses(size) +
            " " +
            className
          }>
          {children}
        </div>
      )}
    </>
  );
}

Danger.propTypes = {
  onClick: PropTypes.func,
  size: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  as: PropTypes.string,
};

Danger.defaultProps = {
  size: "md",
  className: "",
  disabled: false,
  as: "button",
};

function DangerLight({ children, onClick, size, className, disabled, as }) {
  const handleClick = () => {
    if (!onClick) return;
    onClick();
  };
  return (
    <>
      {as == "button" && (
        <button
          onClick={handleClick}
          disabled={disabled}
          className={
            commonClasses +
            "bg-red-500 bg-opacity-30 focus:ring-2 focus:ring-offset-2 focus:ring-red-500 text-red-600 " +
            sizeClasses(size) +
            " " +
            className
          }>
          {children}
        </button>
      )}
      {as == "div" && (
        <div
          onClick={handleClick}
          disabled={disabled}
          className={
            commonClasses +
            "bg-red-500 bg-opacity-30 focus:ring-2 focus:ring-offset-2 focus:ring-red-500 text-red-600 " +
            sizeClasses(size) +
            " " +
            className
          }>
          {children}
        </div>
      )}
    </>
  );
}

DangerLight.propTypes = {
  onClick: PropTypes.func,
  size: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  as: PropTypes.string,
};

DangerLight.defaultProps = {
  size: "md",
  className: "",
  disabled: false,
  as: "button",
};

export { Primary, PrimaryLight, Muted, Danger, DangerLight };
