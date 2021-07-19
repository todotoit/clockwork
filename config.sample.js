export default {
  reboot_at: "04:00",
  timers: {
    start: "08:00",
    stop: "21:00",
  },
  processes: [
    {
      name: "exe-1",
      script: "SCRIPT_PATH_HERE",
      cwd: "SCRIPT_CWD_HERE",
      autostart: true,
      autorestart: false,
      exec_interpreter: "none",
      exec_mode: "fork_mode",
      force_timed_operation: false,
      timers: {
        start: "08:30",
        stop: "20:30",
      },
      on_start: "vcgencmd display_power 1",
      on_stop: "vcgencmd display_power 0",
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
      name: "exe-3",
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
