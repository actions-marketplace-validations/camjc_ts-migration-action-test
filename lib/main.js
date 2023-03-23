"use strict";
const core = require('@actions/core');
const fs = require('fs').promises;
const path = require('path');
async function getAllFilenames(dirPath, fileArr) {
    const files = await fs.readdir(dirPath);
    for (const file of files) {
        const filePath = path.join(dirPath, file);
        const stats = await fs.stat(filePath);
        if (stats.isDirectory() && !filePath.endsWith('node_modules')) {
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
        const extension = path.extname(filename);
        return { ...counts, [extension]: (counts[extension] || 0) + 1 };
    }, {});
}
async function run() {
    try {
        core.debug(`Hello from github runner`);
        const arrayOfFiles = [];
        await getAllFilenames(process.env.GITHUB_WORKSPACE || '/', arrayOfFiles);
        core.setOutput('files-by-extension', countByExtension(arrayOfFiles));
    }
    catch (error) {
        core.setFailed(error.message);
    }
}
run();
