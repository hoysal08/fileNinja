#! /usr/bin/env node
import { checkForPath, countCharactersInFile, countLinesInFile, countWordsInFile, getFileByteSize } from "./helper";

const figlet = require("figlet");
const { Command } = require("commander");
const program = new Command();

console.log(figlet.textSync("FileNinja"));

program
    .version("1.0.0")
    .description("A CLI tool to help with your file statistics and manipulation")
    .option("-c, --checkByte <path>", "Check the byte size of a file at the specified path")
    .option("-l, --countLines <path>", "Count the number of lines in a file at the specified path")
    .option("-w, --countWords <path>", "Count the number of words in a file at the specified path")
    .option("-m, --countCharacters <path>", "Count the number of characters in a file at the specified path")
    .option("-a, --all <path>", "Equivalent to -c, -l, and -w combined")
    .parse(process.argv);

const options = program.opts();

if (process.argv.slice(2).length==0) {
    program.outputHelp();
    process.exit(1);
  }

if (options.checkByte) {
    const result = getFileByteSize(options.checkByte);
    if (result.success) {
        console.log(`File size: ${result.sizeInBytes} bytes`);
    } else {
        console.log(`Error: ${result.errorMessage}`);
    }
}

if (options.countLines) {
    const result = countLinesInFile(options.countLines);
    if (result.success) {
        console.log(`Number of lines in file: ${result.lineCount}`);
    } else {
        console.log(`Error: ${result.errorMessage}`);
    }
}

if (options.countWords) {
    const result = countWordsInFile(options.countWords);
    if (result.success) {
        console.log(`Number of words in file: ${result.wordCount}`);
    } else {
        console.log(`Error: ${result.errorMessage}`);
    }
}

if (options.countCharacters) {
    const result = countCharactersInFile(options.countCharacters);
    if (result.success) {
        console.log(`Number of characters in file: ${result.characterCount}`);
    } else {
        console.log(`Error: ${result.errorMessage}`);
    }
}


if (!process.argv.slice(2).some(arg => arg.startsWith('-'))) {
    const path = process.argv[2]; // Assuming the first non-option argument is the file path
    checkForPath(path);
    const byteResult = getFileByteSize(path);
    const lineResult = countLinesInFile(path);
    const wordResult = countWordsInFile(path);

    if (byteResult.success) {
        console.log(`File size: ${byteResult.sizeInBytes} bytes`);
    } else {
        console.log(`Error: ${byteResult.errorMessage}`);
    }

    if (lineResult.success) {
        console.log(`Number of lines in file: ${lineResult.lineCount}`);
    } else {
        console.log(`Error: ${lineResult.errorMessage}`);
    }

    if (wordResult.success) {
        console.log(`Number of words in file: ${wordResult.wordCount}`);
    } else {
        console.log(`Error: ${wordResult.errorMessage}`);
    }
}