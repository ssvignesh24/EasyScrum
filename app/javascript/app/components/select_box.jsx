/** @format */

import React, { useState, Fragment, useEffect } from "react";
import { Menu, Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import PropTypes from "prop-types";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function SelectBox({ options, onChange, selected, ignore, error }) {
  const [currentlySelected, setCurrentlySelected] = useState({});

  useEffect(() => {
    const currentValue = selected ? selected : options[0];
    setCurrentlySelected(currentValue);
  }, [selected]);

  const setSelected = function (value) {
    setCurrentlySelected(value);
    onChange(value);
  };

  return (
    <Listbox value={currentlySelected} onChange={setSelected}>
      {(payload) => (
        <>
          <div className="mt-1 relative w-full">
            <Listbox.Button className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-3.5 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm">
              <span className="flex items-center">
                <span
                  className="block truncate"
                  dangerouslySetInnerHTML={{
                    __html: currentlySelected.name,
                  }}></span>
              </span>
              <span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
            </Listbox.Button>

            <Transition
              show={payload.open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0">
              <Listbox.Options
                static
                className="absolute mt-1 w-full bg-white shadow-lg max-h-56 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                {options.map((option) => (
                  <Listbox.Option
                    key={option.key}
                    value={option}
                    disabled={ignore == option.key}
                    className={({ active }) =>
                      classNames(
                        active ? "text-white bg-green-600" : "text-gray-900",
                        "cursor-default select-none relative py-2 pl-3 pr-9"
                      )
                    }>
                    {({ selected, active }) => (
                      <>
                        <div className="flex items-center">
                          <span
                            className={classNames(selected ? "font-semibold" : "font-normal", "block truncate")}
                            dangerouslySetInnerHTML={{ __html: option.name }}></span>
                        </div>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? "text-white" : "text-green-600",
                              "absolute inset-y-0 right-0 flex items-center pr-4"
                            )}>
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </>
      )}
    </Listbox>
  );
}

SelectBox.propTypes = {
  options: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  selected: PropTypes.any,
  ignore: PropTypes.string,
  error: PropTypes.string,
};

export default SelectBox;
