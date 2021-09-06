/** @format */

import React, { useState } from "react";
import ReactDOM from "react-dom";
import SelectBox from "./select_box";
import Checkbox from "./checkbox";
import _ from "lodash";

const Dropdown = function ({ options, onChange }) {
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
    return <SelectBox options={selectOptions} onChange={onChange} />;
  } else {
    let selectOptions = [{ key: "", name: "Select" }];
    selectOptions = selectOptions.concat(
      options.map((option) => {
        return { key: option, name: option };
      })
    );
    return <SelectBox options={selectOptions} onChange={onChange} />;
  }
};

const Rating = function ({ maxRating, onSelect }) {
  const [rating, setRating] = useState();

  return (
    <div className="flex w-full">
      {_.times(maxRating, (n) => {
        let val = n + 1;
        return (
          <div
            className={
              "rounded-full mr-2 flex items-center justify-center cursor-pointer hover:bg-green-100 " +
              (rating == val ? "bg-green-500 text-white hover:bg-green-500 " : "bg-gray-100 ") +
              (maxRating == 5 ? " w-12 h-12 " : " w-10 h-10 ")
            }
            key={n}
            onClick={() => {
              setRating(val);
              onSelect(val);
            }}>
            {val}
          </div>
        );
      })}
    </div>
  );
};

const Checklist = function ({ options, onChange }) {
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

export { Dropdown, Rating, Checklist };
