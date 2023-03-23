"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = __importDefault(require("@actions/core"));
const fs = require('fs').promises;
const path_1 = __importDefault(require("path"));
async function getAllFilenames(dirPath, fileArr) {
    const files = await fs.readdir(dirPath);
    for (const file of files) {
        const filePath = path_1.default.join(dirPath, file);
        const stats = await fs.stat(filePath);
        if (stats.isDirectory()) {
            await getAllFilenames(filePath, fileArr);
        }
        else {
            fileArr.push(filePath);
        }
    }
    return fileArr;
}
function countByExtension(filenames) {
    return filenames.reduce((counts, filename) => {
        const extension = filename.split('.').pop() || '';
        return { ...counts, [extension]: (counts[extension] || 0) + 1 };
    }, {});
}
async function run() {
    try {
        core_1.default.debug(`Hello from github runner`);
        const arrayOfFiles = [];
        getAllFilenames(process.env.GITHUB_WORKSPACE || '/', arrayOfFiles);
        core_1.default.setOutput('files-by-extension', countByExtension(arrayOfFiles));
    }
    catch (error) {
        core_1.default.setFailed(error.message);
    }
}
run();
