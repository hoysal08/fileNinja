import { CharacterCountResult, FileSizeInfo, LineCountResult, WordCountResult } from "./types";
const fs = require("fs");

export function getFileByteSize(path: string): FileSizeInfo {
    checkForPath(path);
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

export function countLinesInFile(path: string): LineCountResult {
    checkForPath(path);
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

export function countWordsInFile(path: string): WordCountResult {
    checkForPath(path);
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

export function countCharactersInFile(path: string): CharacterCountResult {
    checkForPath(path);
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

export function checkForPath(path: string) {
    if (!path) {
        throw new Error("You must provide a filename using <path> argument.");
    }
}