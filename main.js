import dotenv from "dotenv";
import path from "path";
import pm2 from "pm2";
import child_process from "child_process";
import { log, error } from "./utils/index.js";
import Process from "./modules/process.js";
import config from './config.js'

dotenv.config();
let stopping = false;
let processes = [];

pm2.connect(function (err) {
  if (err) {
    error(err);
    process.exit(2);
  }
  init(config);
});

function init() {
  processes = config.processes.map((p) => new Process(p, pm2));
}

function reboot() {
  consola.info(chalk.yellow("system reboot") + "initiated");
  child_process.exec(
    path.resolve("./reboot.bat"),
    function (error, stdout, stderr) {
      console.log(stdout);
    }
  );
  stopAll();
}

function startAll() {
  const promises = processes.map(async (p) => p.start());
  return Promise.all(promises);
}

function stopAll(exiting) {
  const promises = processes.map(async (p) => p.stop());
  return Promise.all(promises);
}

function exitHandler(sig) {
  if (stopping && sig === "SIGINT")
    log("shutdown already in progress, please wait");
  if (stopping) return;
  stopping = true;

  stopAll()
    .then(() => {
      log("all done, closing manager");
      process.exit(0);
    })
    .catch((err) => {
      error(err);
      process.exit(1);
    });
}

process.on("exit", () => {
  exitHandler("exit");
});
process.on("SIGINT", () => {
  exitHandler("SIGINT");
});
process.on("SIGUSR1", () => {
  exitHandler("SIGUSR1");
});
process.on("SIGUSR2", () => {
  exitHandler("SIGUSR2");
});
