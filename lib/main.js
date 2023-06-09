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
function sumValues(counts, extensions) {
    let sum = 0;
    for (let extension of extensions) {
        if (counts[extension]) {
            sum += counts[extension];
        }
    }
    return sum;
}
async function run() {
    try {
        const arrayOfFiles = [];
        await getAllFilenames(process.env.GITHUB_WORKSPACE || '/', arrayOfFiles);
        const counts = countByExtension(arrayOfFiles);
        core.setOutput('files-by-extension', counts);
        const tsCount = sumValues(counts, ['.ts', '.tsx']);
        const jsCount = sumValues(counts, ['.js', '.jsx']);
        const total = tsCount + jsCount;
        core.debug(tsCount);
        core.debug(jsCount);
        core.debug(total);
        core.setOutput('ts-percent', Math.floor((tsCount / total) * 100));
    }
    catch (error) {
        core.setFailed(error.message);
    }
}
run();
