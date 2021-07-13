# Clockwork

Production process manager to handle program launch and stop at specified times.
Requires NodeJS `> v14.17`

### Sample config

```js
    {
      name: "clockwork-exe", // application name
      script: "EXE_PATH_HERE", // path to executable or .js
      cwd: "./test",  // cwd for the launched process
      autostart: true, // auto start on launch without waiting for timers
      autorestart: false, // auto restart on crash
      force_timed_operation: false, // disable autostart if outside operating hours
      timers: {
        start: "08:00", // start at specified time
        stop: "20:00", // stop at specified time
      },
      exec_interpreter: "none", // use if launching binary exe
      exec_mode: "fork_mode", // use if launching binary exe
      on_start: "vcgencmd display_power 1", // shell cmd to be run on launch
      on_stop: "vcgencmd display_power 0", // shell cmd to be run on stop
      // see pm2 docs for more options
    }
```

### Electron on Windows

Use the win-unpacked directory instead of the portable .exe
