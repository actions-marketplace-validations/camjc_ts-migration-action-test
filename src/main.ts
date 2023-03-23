const core = require('@actions/core');
const path = require('path');
const { exec } = require("child_process");

async function getAllFilenames(dirPath: string) {
  exec("cd " + dirPath + " && git ls-files", (error, stdout, stderr) => {
    return stdout.split('\r\n');
  })
}

function countByExtension(filenames: string[]) {
  return filenames.reduce((counts: { [x: string]: number }, filename: string) => {
    const extension = path.extname(filename);
    return { ...counts, [extension]: (counts[extension] || 0) + 1 };
  }, {});
}

async function run() {
  try {
    core.debug(`Hello from github runner`);
    const arrayOfFiles: string[] = (await getAllFilenames(process.env.GITHUB_WORKSPACE || '/') as any);
    core.setOutput('files-by-extension', countByExtension(arrayOfFiles));
  } catch (error) {
    core.setFailed((error as any).message);
  }
}

run();
