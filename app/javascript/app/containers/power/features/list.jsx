/** @format */

import React, { useContext, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Link } from "@reach/router";
import { ChevronRightIcon } from "@heroicons/react/solid";
import FeatureClient from "../../../services/power/features";
import pluralize from "pluralize";

import Toggle from "../../../components/toggle";

export default function () {
  const featureClient = new FeatureClient();
  const [featureData, setFeatureData] = useState({
    state: "loading",
    features: [],
  });

  useEffect(() => {
    featureClient
      .list()
      .then(({ data }) => {
        if (!data.status) return;
        setFeatureData({ state: "loaded", features: data.features });
      })
      .catch((r) =>
        featureClient.handleError(r, () => {
          setFeatureData({ state: "error", features: [] });
        })
      );
    return () => featureClient.cancel();
  }, []);

  const setFeatureState = (featureId, state) => {
    setFeatureData((features_) => {
      return {
        ...features_,
        features: features_.features.map((f) => {
          if (f.id == featureId) f.globallyEnabled = !state;
          return f;
        }),
      };
    });
  };

  const toggleFeature = (state, feature) => {
    featureClient
      .toggle(feature.id, state)
      .then(({ data }) => {
        if (!data.status) return;
      })
      .catch((r) => featureClient.handleError(r, () => setFeatureState(feature.id, !state)));
    setFeatureState(feature.id, state);
  };

  return (
    <div className="w-full h-full">
      <div className="container mx-auto">
        <div className="w-full mx-auto pt-10">
          <div className="flex items-center py-2.5">
            <Link className="text-indigo-500 block" to="/power">
              Manage
            </Link>
            <ChevronRightIcon className="w-5 h-5 text-gray-500 mx-1.5"></ChevronRightIcon> <span>Features</span>
          </div>
          <h1 className="text-2xl font-medium">Features</h1>
          <div className="flex items-center">
            {featureData.state == "loading" && <div className="text-gray-500">Loading features...</div>}
            {featureData.state == "loaded" && (
              <div className="text-gray-500">{pluralize("user", featureData.features.length, true)}</div>
            )}
          </div>
        </div>

        <div className="w-full mx-auto pt-10">
          {featureData.state == "loaded" && (
            <>
              {featureData.features.length == 0 && <p className="text-center">No features</p>}
              {featureData.features.length > 0 &&
                featureData.features.map((feature) => {
                  return (
                    <div
                      className="w-full py-4 px-6 bg-white rounded shadow flex hover:bg-green-50 transition-colors"
                      key={feature.key}>
                      <div className="w-9/12">
                        <p className="font-medium">{feature.name}</p>
                        <div className="flex items-center">
                          <span className="text-gray-500 text-sm">{feature.key}</span>
                          <div className="mx-2 w-1 h-1 rounded-full bg-gray-500"></div>
                          <span className="text-gray-500 text-sm">{feature.description}</span>
                        </div>
                      </div>
                      <div className="w-3/12">
                        <Toggle
                          state={feature.globallyEnabled}
                          labelText=""
                          onChange={(state) => toggleFeature(state, feature)}></Toggle>
                      </div>
                    </div>
                  );
                })}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
