import chalk from 'chalk';
import {
  configFileExists,
  createConfigurationFile,
  parseArgumentsIntoOptions,
  promptForConfigurationFile,
} from './utils'

export async function cli(args) {
  let { runInit, lint, file } = parseArgumentsIntoOptions(args);
  if (runInit) {
    const { exists, path } = await configFileExists();
    if (exists) {
      console.log(chalk.red(`Warning: config file already exists at ${path}`))
      process.exit()
    } else {
      const answers = await promptForConfigurationFile();
      await createConfigurationFile(answers);
      return
    }
  }
  if (lint) {
    if (file) {
      console.log(chalk.green(`linting file ${file}.......`))
      // Lint given file
      process.exit()
    } else {
      console.log(chalk.green('Linting all files in the project'))
      // Retrieve configuration file
      // Get file extension from configuration file
      // Get all files with the file extension inside the app roor folder
      // Lint all files one after the other
      // Display linting results
      process.exit()
    }
  }
}