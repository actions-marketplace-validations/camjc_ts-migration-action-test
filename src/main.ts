import core from '@actions/core';
const fs = require('fs').promises;
import path from 'path';

async function getAllFilenames(dirPath: string, fileArr: string[]) {
  const files = await fs.readdir(dirPath);
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stats = await fs.stat(filePath);
    if (stats.isDirectory()) {
      await getAllFilenames(filePath, fileArr);
    } else {
      fileArr.push(filePath);
    }
  }
  return fileArr;
}

function countByExtension(filenames: string[]) {
  return filenames.reduce((counts: {[x: string]: number}, filename: string) => {
    const extension = filename.split('.').pop() || '';
    return {...counts, [extension]: (counts[extension] || 0) + 1};
  }, {});
}

async function run() {
  try {
    core.debug(`Hello from github runner`);
    const arrayOfFiles = [];
    getAllFilenames(process.env.GITHUB_WORKSPACE || '/', arrayOfFiles);
    core.setOutput('files-by-extension', countByExtension(arrayOfFiles));
  } catch (error) {
    console.error(JSON.stringify(error))
    // core.setFailed((error as any).message);
  }
}

run();
