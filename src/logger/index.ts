import pino, { Level } from "pino";
import PinoPretty from "pino-pretty";
import fs from "node:fs";

const NODE_ENV = (process.env.NODE_ENV ?? "development") as "development" | "production";

if (NODE_ENV !== "development" && NODE_ENV !== "production") {
  throw 'Invalid value for NODE_ENV environment variable. Must be either "development" or "production"';
}

const pinoPrettyOptions = {
  colorize: true,
  translateTime: "HH:MM:ss Z",
  ignore: "pid,hostname",
};

if (!fs.existsSync("./logs")) {
  fs.mkdirSync("./logs/");
}

const streams = {
  development: [
    {
      level: "debug",
      stream: PinoPretty(pinoPrettyOptions),
    },
  ],
  production: [
    {
      level: "info",
      stream: PinoPretty(pinoPrettyOptions),
    },
    {
      level: "warn",
      stream: fs.createWriteStream("./logs/errors.log", {}),
    },
  ],
};

export const requestLogger = pino(
  {
    level: "info",
  },
  pino.multistream(
    [
      {
        level: "info",
        stream: fs.createWriteStream("./logs/fastify.log"),
      },
      {
        level: "warn",
        stream: fs.createWriteStream("./logs/fastify_err.log"),
      },
    ],
    { dedupe: true }
  )
);

export const logger = pino(
  { level: "debug" },
  pino.multistream(streams[NODE_ENV ?? "development"])
);

export function createLogger(name: string, level: Level) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (msg: string | any) {
    if (typeof msg === "string") {
      logger[level]({ name, msg });
    } else {
      logger[level]({ ...msg, name, level });
    }
  };
}

export class Logger {
  constructor(private name: string) {
    this.debug = createLogger(name, "debug");
    this.trace = createLogger(name, "trace");
    this.info = createLogger(name, "info");
    this.warn = createLogger(name, "warn");
    this.error = createLogger(name, "error");
    this.fatal = createLogger(name, "fatal");
  }

  public debug;
  public trace;
  public info;
  public warn;
  public error;
  public fatal;
}
