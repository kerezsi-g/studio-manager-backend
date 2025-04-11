import { startServer } from "./server";

async function preInit() {
  /**
   * Add tasks here that should be ran before starting the server
   */
}

async function postInit() {
  /**
   * Add tasks here that should be ran after the server has started
   */
}

async function onTerminate() {
  /**
   * Add tasks here that should be ran on server shut down
   */
}

process.once("SIGINT", onTerminate);
process.once("SIGTERM", onTerminate);

await preInit();

await startServer();

await postInit();
