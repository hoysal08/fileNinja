import { CharacterCountResult, FileSizeInfo, LineCountResult, WordCountResult } from "./types";

const figlet = require("figlet");
const { Command } = require("commander");
const program = new Command();
const fs = require("fs");

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


function getFileByteSize(path: string): FileSizeInfo {
    try {
        if (fs.existsSync(path)) {
            // Get the file size in bytes
            const stats = fs.statSync(path);
            const fileSizeInBytes = stats.size;
            return {
                success: true,
                sizeInBytes: fileSizeInBytes,
            };
        } else {
            return {
                success: false,
                errorMessage: `File not found at '${path}'`,
            };
        }
    } catch (error) {
        return {
            success: false,
            errorMessage: `Error checking file size:${(error as Error).message}`,
        };
    }
}

function countLinesInFile(path: string): LineCountResult {
    try {
        if (fs.existsSync(path)) {
            const fileContent = fs.readFileSync(path, 'utf8');
            const lines = fileContent.split('\n');
            const lineCount = lines.length;
            return {
                success: true,
                lineCount: lineCount,
            };
        } else {
            return {
                success: false,
                errorMessage: `File not found at '${path}'`,
            };
        }
    } catch (error) {
        return {
            success: false,
            errorMessage: `Error counting lines in file: ${(error as Error).message}`,
        };
    }
}

function countWordsInFile(path: string): WordCountResult {
    try {
        if (fs.existsSync(path)) {
            const fileContent = fs.readFileSync(path, 'utf8');
            const words = fileContent.split(/\s+/).filter((word: string) => word.length > 0);
            const wordCount = words.length;
            return {
                success: true,
                wordCount: wordCount,
            };
        } else {
            return {
                success: false,
                errorMessage: `File not found at '${path}'`,
            };
        }
    } catch (error) {
        return {
            success: false,
            errorMessage: `Error counting words in file: ${(error as Error).message}`,
        };
    }
}

function countCharactersInFile(path: string): CharacterCountResult {
    try {
        if (fs.existsSync(path)) {
            const fileContent = fs.readFileSync(path, 'utf8');
            const containsMultibyteCharacters = /[^\x00-\x7F]/.test(fileContent); // Check for multibyte characters
            if (containsMultibyteCharacters) {
                // If multibyte characters are present, fall back to byte count (like -c)
                const stats = fs.statSync(path);
                const characterCount = stats.size;
                return {
                    success: true,
                    characterCount: characterCount,
                };
            } else {
                const characterCount = fileContent.length;
                return {
                    success: true,
                    characterCount: characterCount,
                };
            }
        } else {
            return {
                success: false,
                errorMessage: `File not found at '${path}'`,
            };
        }
    } catch (error) {
        return {
            success: false,
            errorMessage: `Error counting characters in file: ${(error as Error).message}`,
        };
    }
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