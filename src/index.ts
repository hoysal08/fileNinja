import { FileSizeInfo } from "./types";

const figlet = require("figlet");
const { Command } = require("commander");
const program = new Command();
const fs = require("fs");

console.log(figlet.textSync("FileNinja"));

program
    .version("1.0.0")
    .description("A CLI tool to help with your file statistics and manipulation")
    .option("-c, --checkByte <path>", "Check the byte size of a file at the specified path")
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

if (options.checkByte) {
    const result = getFileByteSize(options.checkByte);
    if (result.success) {
        console.log(`File size: ${result.sizeInBytes} bytes`);
    } else {
        console.log(`Error: ${result.errorMessage}`);
    }
}