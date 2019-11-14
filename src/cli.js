import chalk from 'chalk';
import { logger } from './logger/logger';
import {
  findFilesInDir,
  configFileExists,
  lintDocumentationFiles,
  createConfigurationFile,
  parseArgumentsIntoOptions,
  promptForConfigurationFile,
  getFileExtentionFromConfigFile
} from './utils'


export async function cli(args) {
  let { runInit, lint, file, fix } = parseArgumentsIntoOptions(args);
  if (runInit) {
    const { exists, path } = await configFileExists();
    if (exists) {
      logger.error(chalk.red(`Warning: config file already exists at ${path}`))
      process.exit()
    } else {
      const answers = await promptForConfigurationFile();
      await createConfigurationFile(answers);
      return
    }
  }
  if (lint) {
    if (file) {
      consola.info(chalk.blue(`linting file ${file}.......`))
      // Lint given file
      process.exit()
    } else {
      // Retrieve configuration file
      const { exists, path, type } = await configFileExists();
      if (exists) {
        // Get file extension from configuration file
        const fileExtension = getFileExtentionFromConfigFile(path, type)
        // Get all files with the file extension inside the app roor folder
        const filesToLint = await findFilesInDir(fileExtension)
        consola.info(chalk.blue('Linting files......'))
        // Lint all files one after the other
        const results = lintDocumentationFiles(filesToLint)
        if (fix) {
          // Fix all files based on linting results
        } else {
          // Display linting results
        }
      } else {
        logger.error(
          "No valid doclint configuration file found. Run `doclint --init` from your terminal"
        )
        process.exit()
      }
      process.exit()
    }
  }
}