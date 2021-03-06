import dotenv from "dotenv";
import pm2 from "pm2";
import later from "later";
import { exec } from "child_process";
import { log, error } from "./utils/index.js";
import config from "./config.js";
import Process from "./modules/process.js";

dotenv.config();
let stopping = false;
let rebootInterval = null;
let processes = [];

pm2.connect(function (err) {
  if (err) {
    error(err);
    process.exit(2);
  }
  init(config);
});

function init() {
  const defaultConfig = { ...config };
  delete defaultConfig.processes;
  processes = config.processes.map(
    (p) => new Process({ ...defaultConfig, ...p }, pm2)
  );
  if (config.reboot_at) {
    if (rebootInterval) rebootInterval.clear();
    const rebootSchedule = later.parse.text("at " + config.reboot_at);
    rebootInterval = later.setInterval(() => {
      log(`Scheduled reboot at ${config.reboot_at}`);
      reboot();
    }, rebootSchedule);
  }
}

function reboot() {
  log("system reboot initiated");
  stopAll();
  if (process.platform === "win32") {
    exec("shutdown -r -f -t 5", function (err, stdout, stderr) {
      if (err) error(err);
      if (stderr) error(stderr);
      log(stdout);
    });
  } else {
    exec("sudo reboot", function (err, stdout, stderr) {
      if (err) error(err);
      if (stderr) error(stderr);
      log(stdout);
    });
  }
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
