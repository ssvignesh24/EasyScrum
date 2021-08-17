/** @format */

import React, { useContext, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Link } from "@reach/router";
import { ChevronRightIcon } from "@heroicons/react/solid";
import FeedbackClient from "../../../services/power/feedbacks";
import pluralize from "pluralize";

export default function () {
  const feedbackClient = new FeedbackClient();
  const [feedbackData, setFeedbackData] = useState({
    state: "loading",
    feedbacks: [],
  });

  useEffect(() => {
    feedbackClient
      .list()
      .then(({ data }) => {
        if (!data.status) return;
        setFeedbackData({ state: "loaded", feedbacks: data.feedbacks });
      })
      .catch((r) =>
        feedbackClient.handleError(r, () => {
          setFeedbackData({ state: "error", feedbacks: [] });
        })
      );
    return () => feedbackClient.cancel();
  }, []);

  return (
    <div className="w-full h-full">
      <div className="container mx-auto">
        <div className="w-full mx-auto pt-10">
          <div className="flex items-center py-2.5">
            <Link className="text-indigo-500 block" to="/power">
              Manage
            </Link>
            <ChevronRightIcon className="w-5 h-5 text-gray-500 mx-1.5"></ChevronRightIcon> <span>Feedbacks</span>
          </div>
          <h1 className="text-2xl font-medium">Feedbacks</h1>
          <div className="flex items-center">
            {feedbackData.state == "loading" && <div className="text-gray-500">Loading feedbacks...</div>}
            {feedbackData.state == "loaded" && (
              <div className="text-gray-500">{pluralize("user", feedbackData.feedbacks.length, true)}</div>
            )}
          </div>
        </div>

        <div className="w-full mx-auto pt-5">
          {feedbackData.state == "loaded" && (
            <>
              {feedbackData.feedbacks.length == 0 && <p className="text-center">No feedbacks</p>}
              {feedbackData.feedbacks.length > 0 &&
                feedbackData.feedbacks.map((feedback) => {
                  return (
                    <div
                      className="w-full py-4 px-6 bg-white rounded shadow flex hover:bg-green-50 transition-colors mb-2.5"
                      key={feedback.id}>
                      <div className="w-9/12">
                        <p className="font-medium">{feedback.by.name}</p>
                        <div className="flex items-center">
                          <span className="text-gray-500 text-sm">
                            {feedback.by.type} ID - {feedback.by.id}
                          </span>
                          <div className="mx-2 w-1 h-1 rounded-full bg-gray-500"></div>
                          <span className="text-gray-500 text-sm">Rating: {feedback.rating}</span>
                        </div>
                        {feedback.feedbackComment && (
                          <>
                            <p className="mt-1">{feedback.feedbackComment}</p>
                          </>
                        )}
                        <div className="text-gray-500 text-sm mt-2">{feedback.addedOn}</div>
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
