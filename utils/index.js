import chalk from "chalk";

// Custom logging function
export const log = (msg, namespace = "CLOCKWORK") => {
  console.log(`${chalk.bgHex("#EDF6E5").black(namespace)} ${msg}`);
};

export const error = (msg, namespace = "CLOCKWORK") => {
  console.error(`${chalk.bgHex("#EDF6E5").black(namespace)} ${msg}`);
};