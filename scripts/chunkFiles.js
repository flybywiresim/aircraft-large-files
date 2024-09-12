#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const splitFile = require('split-file');

const MAX_CHUNK_SIZE = 100 * 1024 * 1024; // 100 MiB
const allowedFolders = ['fbw-a380x', 'fbw-a32nx', 'fbw-common'];
const inputPath = process.argv[2] || '.';

const relativePath = (dir) => path.relative(process.cwd(), dir)

const isFolderAllowed = (folderPath) => {
  return allowedFolders.some(allowedFolder => relativePath(folderPath).startsWith(allowedFolder)) && fs.existsSync(folderPath);
};

const deleteExistingChunks = (filePath) => {
  const dir = path.dirname(filePath);
  const fileName = path.basename(filePath);
  const pattern = new RegExp(`^${fileName}\\.*\\.part\\d{2}$`);

  const files = fs.readdirSync(dir);
  files.forEach(file => {
    if (pattern.test(file)) {
      fs.unlinkSync(path.join(dir, file));
      console.log(`Deleted existing chunk: ${path.join(relativePath(dir), file)}`);
    }
  });
};

const processFile = async (filePath, folderPath) => {
  const stats = fs.statSync(filePath);

  if (stats.isFile() && stats.size > MAX_CHUNK_SIZE) {
    deleteExistingChunks(filePath);

    const chunkedFiles = await splitFile.splitFileBySize(filePath, MAX_CHUNK_SIZE);
    const fileName = path.basename(filePath);

    chunkedFiles.forEach((chunkedFile, index) => {
      const newChunkedFileName = `${fileName}.part${String(index + 1).padStart(2, '0')}`;
      const newChunkedFilePath = path.join(folderPath, newChunkedFileName);
      fs.renameSync(chunkedFile, newChunkedFilePath);
    });

    fs.unlinkSync(filePath);
    console.log(`Chunked and removed: ${relativePath(filePath)}`);
  }
};

const recurseChunkFilesInFolder = async (folderPath) => {
  const files = fs.readdirSync(folderPath);

  for (const file of files) {
    if (file.includes('.part')) continue;

    const filePath = path.join(folderPath, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      await recurseChunkFilesInFolder(filePath);
    } else if (stats.isFile()) {
      await processFile(filePath, folderPath);
    }
  }
};

const processFolders = async (basePath) => {
  if (isFolderAllowed(basePath)) {
    console.log(`Processing folder: ${relativePath(basePath)}`);
    await recurseChunkFilesInFolder(basePath);
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
