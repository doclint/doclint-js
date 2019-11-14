import fs from 'fs';
import arg from 'arg';
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import appRoot from 'app-root-path';
import { createConfigFileData } from './helpers'
import { logger } from '../logger/logger'


const checkFileExists = s => new Promise(r=>fs.access(s, fs.F_OK, e => r(!e)));
/**
 * Function to verify if a configuration file for doclint currently exists
 * in the folder
 * @return {Object}
 */
export async function configFileExists() {
  const doclintJSON = await checkFileExists(`${appRoot}/doclint.json`);
  if (doclintJSON) return { exists: true, path: `${appRoot}/doclint.json`, type: 'json' };
  const doclintRC = await checkFileExists(`${appRoot}/doclintrc`);
  if (doclintRC) return { exists: true, path: `${appRoot}/doclintrc`, type: 'rc' };
  const doclintJS = await checkFileExists(`${appRoot}/doclintrc.js`);
  if (doclintJS) return { exists: true, path: `${appRoot}/doclintrc.js`, type: 'js' };
  return { exists: false, path: null, type: null }
}

export function getFileExtentionFromConfigFile(filePath, type) {
  if (type === 'js') {
    const configOpts = require(filePath)
    return configOpts.fileExtension
  }
  if (type === 'json' || type === 'rc') {
    try {
      const jsonString = fs.readFileSync(filePath)
      const configOpts = JSON.parse(jsonString)
      return configOpts.fileExtension
    } catch(err) {
      logger.error(chalk.red(err))
      return
    }
  }
}

/**
 * Function to prompt for configuration file
 * @return {Object}
 */
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

/**
 * Function to create configuration file
 * @param {*} answers The answers that hold the configuration file type selected
 */
export async function createConfigurationFile(answers) {
  const { configFileType } = answers;
  const dataJSON = createConfigFileData(answers)
  let data = JSON.stringify(dataJSON, null, 2)
  if (configFileType === 'doclintrc.js') {
    data = `module.exports = ${data}`;
  }
  const path = `${appRoot}/${configFileType}`;
  fs.writeFile(path, data, { flag: 'wx' }, function (err) {
    logger.info(chalk.green(`Creating a ${configFileType} config file`));
    if (err) {
      logger.error(chalk.yellow(`Warning: You already have an existing ${configFileType} file`));
      throw err;
    }
    logger.success(chalk.green(`${configFileType} created successfully`));
    process.exit()
  });
}

/**
 * Function to pass arguments as options
 * @param {Array} rawArgs The raw arguments
 * @return {Object}       passed arguments in object with boolean values formay
 */
export function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
    {
      '--lint': Boolean,
      '--yes': Boolean,
      '--init': Boolean,
      '--fix': Boolean,
      '-l': '--lint',
      '-y': '--yes',
      '-i': '--init',
      '-f': '--fix',
    },
    {
      argv: rawArgs.slice(2),
    }
  );
  return {
    skipPrompts: args['--yes'] || false,
    fix: args['--fix'] || false,
    lint: args['--lint'] || false,
    file: args._[0],
    runInit: args['--init'] || false,
  };
}

/**
 * Find all files recursively in specific folder with specific extension, e.g:
 * findFilesInDir('./project/src', '.md') ==> ['./project/src/a.md','./project/src/build/index.md']
 * @param  {String} filter       Extension name, e.g: '.md'
 * @param  {String} startPath    Path relative to this file or other file which requires this files
 * @return {Array}               Result files with path string in an array
 */
export async function findFilesInDir(filter, startPath = `${appRoot}`){
  let results = [];
  const foldersToSkip = ['.git', 'node_modules']
  const fileExists = await checkFileExists(`${startPath}`)
  if (!fileExists) {
    logger.error(`directory ${startPath} does not exist`);
    return;
  }

  let files = fs.readdirSync(startPath);

  for(let i = 0; i < files.length; i++) {
    const filename = path.join(startPath, files[i]);
    let stat = fs.lstatSync(filename);
    if (stat.isDirectory()) {
      const gitFolder = filename.toString().includes('.git')
      const nodeModulesFolder = filename.toString().includes('node_modules');
      if (gitFolder || nodeModulesFolder) {
        logger.info(chalk.yellow(`skipping folder ${filename}`));
      } else {
        const filesInSubDirectory = await findFilesInDir(filter, filename); // recursion
        results = results.concat(filesInSubDirectory);
      }
    } else if (filename.indexOf(filter) >= 0) {
      results.push(filename);
    }
  }
  return results;
}

export function lintDocumentationFiles(files) {
  console.log(files)
}