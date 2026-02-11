/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import * as Sentry from '@sentry/nestjs';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  enableLogs: true,
  integrations: [
    Sentry.consoleLoggingIntegration({ levels: ['log', 'warn', 'error'] }),
  ],

  beforeSendLog: (log) => {
    // Drop debug logs in production
    if (log.level === 'debug' || log.level === 'info') {
      return null;
    }

    // Remove sensitive attributes
    if (log.attributes?.password) {
      delete log.attributes.password;
    }

    return log;
  },
});
