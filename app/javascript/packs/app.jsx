/** @format */

import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";

import App from "../app/index";

// Sentry.init({
//   dsn: "https://ab78414bf67544bb9d8f6ca9ef3c1ed5@o940961.ingest.sentry.io/5896823",
//   integrations: [new Integrations.BrowserTracing()],

//   // Set tracesSampleRate to 1.0 to capture 100%
//   // of transactions for performance monitoring.
//   // We recommend adjusting this value in production
//   tracesSampleRate: 1.0,
// });

document.addEventListener("DOMContentLoaded", () => {
  ReactDOM.render(<App name="React" />, document.body.appendChild(document.createElement("div")));
});
