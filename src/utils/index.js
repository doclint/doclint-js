import fs from 'fs';
import arg from 'arg';
import ora from 'ora';
import chalk from 'chalk';
import inquirer from 'inquirer';
import appRoot from 'app-root-path';
import { createConfigFileData } from './helpers'

export async function configFileExists() {
  let checkFileExists = s => new Promise(r=>fs.access(s, fs.F_OK, e => r(!e)));
  const doclintJSON = await checkFileExists(`${appRoot}/doclint.json`);
  if (doclintJSON) return { exists: true, path: `${appRoot}/doclint.json`};
  const doclintRC = await checkFileExists(`${appRoot}/doclintrc`);
  if (doclintRC) return { exists: true, path: `${appRoot}/doclintrc`};
  const doclintJS = await checkFileExists(`${appRoot}/doclintrc.js`);
  if (doclintJS) return { exists: true, path: `${appRoot}/doclintrc.js`};
  return { exists: false, path: null}
}

export async function promptForConfigurationFile() {
  const questions = [
    {
      type: 'list',
      name: 'configFileType',
      message: 'Please choose which configuration file type to use',
      choices: ['doclint.json', 'doclintrc', 'doclintrc.js'],
      default: 'doclint.json',
    },
    {
      type: 'list',
      name: 'docFileType',
      message: 'Please choose your documentation file extention type',
      choices: ['Markdown: md', 'TextFile: txt'],
      default: 'Markdown: md',
    }
  ]
  const answers = await inquirer.prompt(questions);
  return answers;
}

export async function createConfigurationFile(answers) {
  const { configFileType } = answers;
  const dataJSON = createConfigFileData(answers)
  let data = JSON.stringify(dataJSON)
  if (configFileType === 'doclintrc.js') {
    data = `module.exports = ${data}`;
  }
  const path = `${appRoot}/${configFileType}`;
  fs.writeFile(path, data, { flag: 'wx' }, function (err) {
    const spinner = ora(chalk.green(`Creating a ${configFileType} config file`)).start();
    if (err) {
      spinner.fail(chalk.yellow(`Warning: You already have an existing ${configFileType} file`))
      throw err;
    }
    spinner.succeed(chalk.green(`${configFileType} created successfully`));
    process.exit()
  });
}

export function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
    {
      '--lint': Boolean,
      '--yes': Boolean,
      '--init': Boolean,
      '-l': '--lint',
      '-y': '--yes',
      '-i': '--init',
    },
    {
      argv: rawArgs.slice(2),
    }
  );
  return {
    skipPrompts: args['--yes'] || false,
    lint: args['--lint'] || false,
    file: args._[0],
    runInit: args['--init'] || false,
  };
}