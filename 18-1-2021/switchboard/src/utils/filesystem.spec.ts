import {
  validateExistPath,
  copyDir,
  validateNotExistPath,
  moveData,
  moveFile,
  copyFile,
  renameData,
  cleanDir,
  createFile,
  createFolder
} from './filesystem';

const testDirPath = `${__dirname}/../../tests`;

describe('Filesystem', () => {
  beforeAll(() => {
    const files = [
      'batman.pdf',
      'folder/marvel/ironman.pdf',
      'flash.jpeg',
      'folder/marvel/hulk.png',
      'folder/marvel/loki.doc',
      'harryPotter.ts'
    ];
    const folders = ['folder/a/1', 'folder/b/1', 'folder/marvel/'];
    folders.map((x) => {
      return createFolder(`${testDirPath}/${x}`);
    });
    files.map((x) => {
      return createFile(`${testDirPath}/${x}`);
    });
  });

  it('should file exist', () => {
    validateExistPath("file doesn't exist", `${testDirPath}/batman.pdf`);
    expect(() => {
      validateNotExistPath('file exist', `${testDirPath}/batman.pdf`);
    }).toThrow(Error);
  });

  it('should folder exist', () => {
    validateExistPath("file doesn't exist", `${testDirPath}/folder/a/1`);
    expect(() => {
      validateNotExistPath('folder exist', `${testDirPath}/folder/a/1`);
    }).toThrow(Error);
  });

  it('Should file not exist', () => {
    expect(() => {
      validateExistPath("file doesn't exist", `${testDirPath}/404_not_found.pdf`);
    }).toThrow(Error);
  });

  it('should folder not exist', async () => {
    expect(() => {
      validateExistPath("file doesn't exist", `${testDirPath}/404_not_found`);
    }).toThrow(Error);
  });

  it('should throw copy dir error', () => {
    expect(() => {
      copyDir(`${testDirPath}/not_exist`, `${testDirPath}/another_not_exist`);
    }).toThrow(Error);
  });

  it('should copy dir', () => {
    copyDir(`${testDirPath}/folder/a/1`, `${testDirPath}/folder/a/2`);
    validateExistPath("dir doesn't exist", `${testDirPath}/folder/a/2`);
  });

  it('should copy file', () => {
    copyFile(`${testDirPath}/batman.pdf`, `${testDirPath}/folder/a`);
  });

  it('should move dir', () => {
    moveData(`${testDirPath}/folder/a/2`, `${testDirPath}/folder/a/3`);
    validateNotExistPath('dir was there', `${testDirPath}/folder/a/2`);
    validateExistPath("dir doesn't exist", `${testDirPath}/folder/a/3`);
  });

  it('should rename', () => {
    renameData(`${testDirPath}/batman.pdf`, `${testDirPath}/batman1.pdf`);
  });

  afterAll(() => {
    cleanDir(testDirPath);
    return;
  });
});
