require("dotenv").config();
const path = require("path");
const pm2 = require('pm2');
const consola = require("consola");
const chalk = require("chalk");

const processes = {
    'kw-detection': {
        name: 'kw-detection',
        script: path.resolve(process.env.DETECTION_PATH),
        cwd: path.dirname(process.env.DETECTION_PATH)
    },
    'kw-motors': {
        name: 'kw-motors',
        script: path.resolve(process.env.MOTORS_PATH),
        cwd: path.dirname(process.env.MOTORS_PATH),
        env: {
            windowsHide: false
        }
    },
    'kw-controller': {
        name: 'kw-controller',
        script: path.resolve(process.env.CONTROLLER_PATH),
        args: '-screen-height 1080 -screen-width 1920',
        exec_interpreter: "none",
        exec_mode: "fork_mode",
        env: {
            windowsHide: false
        }
    },
    'kw-server': {
        name: 'kw-server',
        script: 'node_modules/http-server/bin/http-server',
        args: path.resolve(process.env.FRONTEND_PATH) + ' -p 80',
    }
}

pm2.connect(function (err) {
    if (err) {
        consola.error(err);
        process.exit(2);
    }
    pm2.delete('all', err => {
        startAll()
            .then(() => {
                consola.info('waiting 10s for all processes to boot')
                setTimeout(() => {
                    stopAll().then(() => {
                        pm2.disconnect()
                    })
                }, 10000)
            })
    })
});

function deleteAll() {
    consola.info('deleting all processes')
    const promises = [
        deleteProcess('kw-controller'),
        deleteProcess('kw-detection'),
        deleteProcess('kw-motors'),
        deleteProcess('kw-server'),
    ]
    return Promise.all(promises)
}

function startAll() {
    consola.info('starting all processes')
    const promises = [
        start('kw-controller'),
        start('kw-detection'),
        start('kw-motors'),
        start('kw-server'),
    ]
    return Promise.all(promises)
}

function stopAll(exiting) {
    consola.info('stopping all processes')
    const promises = [
        stop('kw-controller'),
        stop('kw-detection'),
        stop('kw-motors'),
        stop('kw-server'),
    ]
    return Promise.all(promises)
}

function start(proc) {
    consola.start(proc)
    return new Promise((resolve, reject) => {
        pm2.restart(processes[proc], err => {
            if (err) {
                consola.error(err)
                return reject(err)
            }
            return resolve()
        })
    })
}

function deleteProcess(proc) {
    consola.log(chalk.yellow('delete ') + proc)
    return new Promise((resolve, reject) => {
        pm2.delete(proc, err => {
            if (err) {
                consola.error(err)
                return reject(err)
            }
            return resolve()
        })
    })
}

function stop(proc) {
    consola.log(chalk.red('stop ') + proc)
    return new Promise((resolve, reject) => {
        pm2.stop(proc, err => {
            if (err) {
                consola.error(err)
                return reject(err)
            }
            return resolve()
        })
    })
}