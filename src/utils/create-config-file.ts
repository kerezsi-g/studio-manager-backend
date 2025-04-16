import fs from "fs";
import path from "path";

import { Static, TSchema, Type as T } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";

import { Logger } from "logger/index";

const logger = new Logger("Config");

const ROOT_PATH = "./config";

if (!fs.existsSync(ROOT_PATH)) {
  fs.mkdirSync(ROOT_PATH);
}

// Easily swappable to eg. yaml
const FORMAT = JSON;
const EXT = "json";

/**
 * Creates a configuration object, managing its storage in the specified format.
 *
 * The function does the following:
 * - Looks for a configuration file in the root "config" directory.
 * - If the file exists, reads and validates the configuration against the provided schema.
 * - If the file doesn't exist, creates a default configuration file.
 * - If the file is invalid, attempts to fix it by adding missing properties with default values.
 * - If all else fails, falls back to a default configuration in memory.
 *
 * @param name Used to generate the filename.
 * @param configSchema The Typebox schema to validate the configuration against or generate it.
 * @returns The loaded configuration object, either from file or with default values.
 */
export function createConfig<T extends TSchema>(name: string, configSchema: T): Static<T> {
  /** Filename of the generated/read config */
  const fileName = path.join(ROOT_PATH, `${name}.${EXT}`);

  try {
    /**
     * Try to read and return the existing configuration
     */
    if (fs.existsSync(fileName)) {
      return readConfig(fileName, configSchema);
    }

    /* If there is no existing file, create the default configuration and write it */
    return createDefaultConfig(fileName, configSchema);
  } catch (err) {
    /**
     * If the file-based approach failed, try to create the default configuration in memory only
     */
    const config = Value.Create(configSchema);

    /**
     *  Halt the application start up if all fail-safes are unsuccessful
     */
    const isValid = Value.Check(configSchema, [], config);
    if (!isValid) {
      const msg = `Error registering config for "${name}". The schema does not properly declare default values`;
      logger.fatal(msg);
      throw msg;
    }

    const msg = `Failed to parse config file "${fileName}". Falling back to default configuration in-memory.`;
    logger.error(msg);

    return config;
  }
}

/**
 /**
 * @internal
 * 
 * Creates a default configuration object from the input Typebox schema and writes it to the specified file.
 * 
 * @param fileName The path to the configuration file.
 * @param configSchema The Typebox schema for the configuration.
 */
function createDefaultConfig<T extends TSchema>(fileName: string, configSchema: T): Static<T> {
  const config = Value.Create(configSchema);

  /**
   * Try to catch schemas with missing default value declarations at development time
   *
   * ! Note that V.Create() might initialize some types without explicitly set default values
   * ! eg.: A property of Type.Boolean() WILL be coerced to `false`, even if no default is set
   */
  const is_valid = Value.Check(configSchema, [], config);
  if (!is_valid) {
    const msg = `Tried to create config file"${fileName}", but the schema does not declare default values`;
    logger.error(msg);
    throw msg;
  }

  const content = FORMAT.stringify(config, null, "\t");
  fs.writeFileSync(fileName, content);

  logger.info(`Created default configuration file: ${fileName}`);

  return config;
}

/**
 * @internal
 *
 * Reads the config file at specified location, cleans it against the schema, and validates it.
 *
 * @param fileName The path to the configuration file.
 * @param configSchema The Typebox schema for the configuration.
 */
function readConfig<T extends TSchema>(fileName: string, configSchema: T): Static<T> {
  const content = fs.readFileSync(fileName, "utf-8");

  const parsed = FORMAT.parse(content);

  /** Clear properties not defined in the schema */
  const cleaned = Value.Clean(configSchema, [], parsed);

  /** Check the cleaned object against the provided schema */
  const is_valid = Value.Check(configSchema, [], cleaned);

  /**
   *  Return the validated configuration object if valid
   */
  if (is_valid) {
    logger.info(`Loaded configuration file: ${fileName}`);
    return cleaned;
  }

  /**
   * Check if the configuration object is partially valid, ie. missing properties from the current schema definition
   * This is meant to make additions of new properties over time less error-prone
   */
  const partialSchema = T.Partial(configSchema);
  const isPartialValid = Value.Check(partialSchema, cleaned);

  /**
   * Fill the missing properties with default values and write to file, so that they are visible to the environment.
   */
  if (isPartialValid) {
    /**
     * ! See the warning about V.Create() above, the same applies here
     */
    const patchedConfig = Value.Default(configSchema, [], cleaned);

    const content = FORMAT.stringify(patchedConfig, null, "\t");

    fs.writeFileSync(fileName, content);

    logger.warn(
      `Parsed and updated configuration "${fileName}". Missing properties have been written to the existing file.`
    );

    return patchedConfig as Static<T>;
  }

  throw { msg: `Failed to parse configuration file: ${fileName}` };
}
