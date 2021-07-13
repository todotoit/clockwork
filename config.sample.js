export default {
  processes: [
    {
      name: "script-1",
      script: "SCRIPT_PATH_HERE",
      cwd: "SCRIPT_CWD_HERE",
      timers: {
        start: "08:00",
        stop: "20:00",
      },
    },
    {
      name: "script-2",
      script: "SCRIPT_PATH_HERE",
      cwd: "SCRIPT_CWD_HERE",
      env: {
        windowsHide: false,
      },
    },
    {
      name: "script-3",
      script: "SCRIPT_PATH_HERE",
      args: "-screen-height 1080 -screen-width 1920",
      exec_interpreter: "none",
      exec_mode: "fork_mode",
      env: {
        windowsHide: false,
      },
    },
    {
      name: "script-4",
      script: "node_modules/http-server/bin/http-server",
      args: "SCRIPT_ARGS_HERE",
    },
  ],
};
