const core = require('@actions/core');
const fs = require('fs').promises;
const path = require('path');

async function getAllFilenames(dirPath: string, fileArr: string[]) {
  const files = await fs.readdir(dirPath);
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stats = await fs.stat(filePath);
    if (stats.isDirectory() && !filePath.endsWith('node_modules')) {
      await getAllFilenames(filePath, fileArr);
    } else {
      fileArr.push(filePath);
    }
  }
  return fileArr;
}

function countByExtension(filenames: string[]) {
  return filenames.reduce((counts: { [x: string]: number }, filename: string) => {
    const extension = path.extname(filename);
    return { ...counts, [extension]: (counts[extension] || 0) + 1 };
  }, {});
}

function sumValues(counts: { [key: string]: number }, extensions: string[]) {
  let sum = 0
  for (let extension in extensions) {
    counts[extension] += 1
  }
  return sum
}

async function run() {
  try {
    core.debug(`Hello from github runner`);
    const arrayOfFiles = [];
    await getAllFilenames(process.env.GITHUB_WORKSPACE || '/', arrayOfFiles);
    const counts = countByExtension(arrayOfFiles);
    core.setOutput('files-by-extension', counts);
    const tsCount = sumValues(counts, ['.ts', '.tsx'])
    const jsCount = sumValues(counts, ['.js', '.jsx'])
    core.setOutput('ts-percent', Math.floor((tsCount / tsCount + jsCount) * 100));
  } catch (error) {
    core.setFailed((error as any).message);
  }
}

run();
