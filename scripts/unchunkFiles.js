#!/usr/bin/env node
/* eslint-disable no-undef */

const fs = require('fs');
const path = require('path');
const splitFile = require('split-file');

const allowedFolders = ['fbw-a380x', 'fbw-a32nx', 'fbw-common'];
const inputPath = process.argv[2] || '.';

const relativePath = (dir) => path.relative(process.cwd(), dir);

const isFolderAllowed = (folderPath) => {
  return (
    allowedFolders.some((allowedFolder) => relativePath(folderPath).startsWith(allowedFolder)) &&
    fs.existsSync(folderPath)
  );
};

const unchunkFilesInFolder = async (folderPath) => {
  const files = fs.readdirSync(folderPath);

  const chunkGroups = {};
  for (const file of files) {
    const match = file.match(/(.*)\.part(\d{2})$/);
    if (match) {
      const baseName = match[1];
      if (!chunkGroups[baseName]) {
        chunkGroups[baseName] = [];
      }
      chunkGroups[baseName].push(file);
    }
  }
  for (const baseName in chunkGroups) {
    const chunkedFiles = chunkGroups[baseName];
    chunkedFiles.sort((a, b) => {
      const numA = parseInt(a.match(/\.part(\d{2})$/)[1], 10);
      const numB = parseInt(b.match(/\.part(\d{2})$/)[1], 10);
      return numA - numB;
    });

    const chunkPaths = chunkedFiles.map((file) => path.join(folderPath, file));
    const outputFilePath = path.join(folderPath, baseName);

    try {
      await splitFile.mergeFiles(chunkPaths, outputFilePath);
      console.log(`Merged chunks into: ${relativePath(outputFilePath)}`);

      chunkPaths.forEach((chunkPath) => {
        fs.unlinkSync(chunkPath);
        console.log(`Deleted chunk file: ${relativePath(chunkPath)}`);
      });
    } catch (err) {
      console.error(`Error merging files for ${baseName}:`, err.message);
    }
  }
};

const recurseProcessFolder = async (basePath) => {
  const items = fs.readdirSync(basePath);

  for (const item of items) {
    const fullPath = path.join(basePath, item);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      await recurseProcessFolder(fullPath);
    } else if (stats.isFile() && item.match(/\.part\d{2}$/)) {
      await unchunkFilesInFolder(basePath);
      break;
    }
  }
};

const processFolders = async (basePath) => {
  if (isFolderAllowed(basePath)) {
    console.log(`Processing folder: ${relativePath(basePath)}`);
    await recurseProcessFolder(basePath);
  } else {
    console.log(`Skipping unallowed or non-existent folder: ${relativePath(basePath)}`);
  }
};

(async () => {
  const stats = fs.statSync(inputPath);
  if (stats.isDirectory()) {
    if (inputPath === '.') {
      for (const folder of allowedFolders) {
        await processFolders(path.join(process.cwd(), folder));
      }
    } else {
      await processFolders(path.resolve(inputPath));
    }
  } else {
    console.error('Error: The specified path is not a directory.');
    process.exit(1);
  }
})();
