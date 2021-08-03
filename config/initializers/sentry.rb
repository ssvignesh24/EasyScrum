Sentry.init do |config|
  config.dsn = 'https://ef5e8fee17d24053821dcd5a2bc7d5c2@o940961.ingest.sentry.io/5890101'
  config.breadcrumbs_logger = [:active_support_logger, :http_logger]

  # Set tracesSampleRate to 1.0 to capture 100%
  # of transactions for performance monitoring.
  # We recommend adjusting this value in production
  config.traces_sample_rate = 0.5
end