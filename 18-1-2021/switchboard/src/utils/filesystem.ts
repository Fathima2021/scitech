import fs from 'fs-extra';
import path from 'path';

const isExist = (path: string) => {
  return fs.existsSync(path);
};

const validateExistPath = (errorMessage: string, path: string) => {
  if (!isExist(path)) {
    throw new Error(errorMessage);
  }
  return true;
};

const validateNotExistPath = (errorMessage: string, path: string) => {
  if (isExist(path)) {
    throw new Error(errorMessage);
  }
};

const copyDir = (source: string, destination: string) => {
  validateExistPath('Invalid source path', source);
  // validateNotExistPath('Invalid destination path', destination);
  return fs.copySync(source, destination, {
    recursive: true
  });
};

const copyFile = (source: string, destination: string) => {
  validateExistPath('Invalid source path', source);
  validateExistPath('Invalid destination path', destination);
  let file = path.basename(source);
  let sourcep = fs.createReadStream(source);
  let dest = fs.createWriteStream(path.resolve(destination, file));
  sourcep.pipe(dest);
  sourcep.on('end', function () {
    return;
  });
  sourcep.on('error', function (err: any) {
    throw err;
  });
};

const moveData = (source: string, destination: string) => {
  validateExistPath('Invalid source path', source);
  // validateNotExistPath('Invalid destination path', destination);
  return fs.moveSync(source, destination);
};

const moveFile = (source: string, destination: string) => {
  validateExistPath('Invalid source path', source);
  validateExistPath('Invalid destination path', destination);
  let file = path.basename(source);
  let dest = path.resolve(destination, file);
  return fs.renameSync(source, dest);
};

const renameData = (source: string, destination: string) => {
  validateExistPath('Invalid source path', source);
  validateNotExistPath('File with same name already exist', destination);
  return fs.renameSync(source, destination);
};

const getDirTree = () => {
  //
};

const getDirFiles = () => {
  //
};

const createFile = (path: string) => {
  return fs.createFileSync(path);
};
const createFolder = (path: string) => {
  return fs.mkdirpSync(path);
};
const cleanDir = (path: string) => {
  return fs.rmSync(`${path}`, {
    recursive: true
  });
};

export {
  validateNotExistPath,
  validateExistPath,
  copyDir,
  copyFile,
  moveData,
  moveFile,
  renameData,
  createFile,
  createFolder,
  cleanDir
};
