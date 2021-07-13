import later from "later";
import chalk from "chalk";
import { exec } from "child_process";
import { log, error } from "../utils/index.js";

later.date.localTime();

export default class Process {
  constructor(config, pm2) {
    this.pm2 = pm2;
    this.config = config;
    this.running = false;
    this.logName = chalk.bold(this.config.name);
    this.init();
  }

  init() {
    if (this.config.timers) this.setupTimers(this.config);
    if (this.config.autostart) {
      if (!this.config.force_timed_operation || this.checkOperationHours())
        this.start();
    }
  }

  setupTimers() {
    if (this.startupInterval) this.startupInterval.clear();
    if (this.shutdownInterval) this.shutdownInterval.clear();

    const startupSchedule = later.parse.text("at " + this.config.timers.start);
    this.startupInterval = later.setInterval(() => {
      log(`Scheduled start: ${this.logName} (${this.config.timers.start})`);
      if (this.disableTimers) return;
      this.start();
    }, startupSchedule);

    const shutdownSchedule = later.parse.text("at " + this.config.timers.stop);
    this.startupInterval = later.setInterval(() => {
      log(`Scheduled stop: ${this.logName} (${this.config.timers.stop})`);
      if (this.disableTimers) return;
      this.stop();
    }, shutdownSchedule);
  }

  start() {
    return new Promise((resolve, reject) => {
      log(`Starting ${this.logName}`);
      if (this.config.on_start) this.run(this.config.on_start);
      this.pm2.restart(this.config, (err) => {
        if (err) {
          error(err);
          return reject(err);
        }
        this.running = true;
        return resolve();
      });
    });
  }

  stop() {
    if (!this.running) return Promise.resolve(true);
    log("Stopping " + this.logName);
    if (this.config.on_stop) this.run(this.config.on_stop);
    return new Promise((resolve, reject) => {
      this.pm2.stop(this.config.name, (err) => {
        if (err) {
          error(`[${this.logName}]`, err.message);
          return resolve(err);
        }
        return resolve();
      });
    });
  }

  run(command) {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.log(error.message);
        return;
      }
      if (stderr) {
        console.log(stderr);
        return;
      }
      console.log(stdout);
    });
  }

  checkOperationHours() {
    const d = new Date();
    const dayStart = new Date();
    dayStart.setHours(...this.config.timers.start.split(":"));
    const dayEnd = new Date();
    dayEnd.setHours(...this.config.timers.stop.split(":"));
    return d > dayStart && d < dayEnd;
  }
}
