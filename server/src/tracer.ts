import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';

const traceExporter = new OTLPTraceExporter({});

const DISABLED = { enabled: false } as const;

// Create SDK instance with comprehensive configuration
const sdk = new NodeSDK({
  traceExporter,
  instrumentations: [
    getNodeAutoInstrumentations({
      // Disable instrumentations that might cause issues
      '@opentelemetry/instrumentation-fs': { enabled: false },
      // ── Disable: not used in this project ────────────────────────────────
      '@opentelemetry/instrumentation-amqplib': DISABLED,
      '@opentelemetry/instrumentation-aws-lambda': DISABLED,
      '@opentelemetry/instrumentation-aws-sdk': DISABLED,
      '@opentelemetry/instrumentation-bunyan': DISABLED,
      '@opentelemetry/instrumentation-cassandra-driver': DISABLED,
      '@opentelemetry/instrumentation-connect': DISABLED,
      '@opentelemetry/instrumentation-cucumber': DISABLED,
      '@opentelemetry/instrumentation-dataloader': DISABLED,
      '@opentelemetry/instrumentation-dns': DISABLED,
      '@opentelemetry/instrumentation-generic-pool': DISABLED,
      '@opentelemetry/instrumentation-graphql': DISABLED,
      '@opentelemetry/instrumentation-grpc': DISABLED,
      '@opentelemetry/instrumentation-hapi': DISABLED,
      '@opentelemetry/instrumentation-kafkajs': DISABLED,
      '@opentelemetry/instrumentation-knex': DISABLED,
      '@opentelemetry/instrumentation-koa': DISABLED,
      '@opentelemetry/instrumentation-lru-memoizer': DISABLED,
      '@opentelemetry/instrumentation-memcached': DISABLED,
      '@opentelemetry/instrumentation-mongodb': DISABLED, // mongoose covers this
      '@opentelemetry/instrumentation-mysql': DISABLED,
      '@opentelemetry/instrumentation-mysql2': DISABLED,
      '@opentelemetry/instrumentation-net': DISABLED,
      '@opentelemetry/instrumentation-oracledb': DISABLED,
      '@opentelemetry/instrumentation-pg': DISABLED,

      '@opentelemetry/instrumentation-redis': DISABLED, // ioredis covers this
      '@opentelemetry/instrumentation-restify': DISABLED,
      '@opentelemetry/instrumentation-router': DISABLED,
      '@opentelemetry/instrumentation-runtime-node': DISABLED,
      '@opentelemetry/instrumentation-socket.io': DISABLED,
      '@opentelemetry/instrumentation-tedious': DISABLED,
      '@opentelemetry/instrumentation-undici': DISABLED,
      '@opentelemetry/instrumentation-winston': DISABLED,
      // Configure HTTP instrumentation for better trace context
      '@opentelemetry/instrumentation-pino': { enabled: true },
      '@opentelemetry/instrumentation-http': {
        enabled: true,
        ignoreIncomingRequestHook: (req) => {
          // Ignore health check endpoints
          return (
            req.url?.includes('/health') ||
            req.url?.includes('/metrics') ||
            false
          );
        },
      },
    }),
  ],
});

// Start the SDK
try {
  sdk.start();
  console.log('OpenTelemetry instrumentation initialized successfully');
} catch (error) {
  console.error('Error initializing OpenTelemetry:', error);
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  sdk
    .shutdown()
    .then(() => console.log('OpenTelemetry SDK shut down successfully'))
    .catch((error) =>
      console.error('Error shutting down OpenTelemetry:', error),
    )
    .finally(() => process.exit(0));
});

export default sdk;
