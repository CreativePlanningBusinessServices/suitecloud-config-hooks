import { access, mkdir, opendir, rename } from 'fs/promises';

async function organizeImportedObjects(options: ObjectImportOptions): Promise<void> {
  const objectDirectoryPath = getObjectDirectoryPath(options);
  const fileNames = await fetchUnorganizedFileNames(objectDirectoryPath);
  for (const name of fileNames) {
    await moveFile(name, objectDirectoryPath);
  }
}

async function moveFile(fileName: string, directoryPath: string) {
  const oldPath = `${directoryPath}/${fileName}`;
  const newFolderPath = `${directoryPath}/${getFolderName(fileName)}`;
  if (!(await doesFolderExist(newFolderPath))) {
    await mkdir(newFolderPath);
  }
  const newPath = `${newFolderPath}/${fileName}`;
  rename(oldPath, newPath);
}

async function doesFolderExist(directoryPath: string): Promise<boolean> {
  try {
    await access(directoryPath);
    return true;
  } catch {
    return false;
  }
}

function getFolderName(fileName: string): string {
  return 'Test'; //TODO:
}

async function fetchUnorganizedFileNames(directoryPath: string): Promise<string[]> {
  const fileNames: string[] = [];
  const directory = await opendir(directoryPath);
  for await (const entry of directory) {
    if (entry.isFile()) {
      fileNames.push(entry.name);
    }
  }
  return fileNames;
}

function getObjectDirectoryPath(options: ObjectImportOptions): string {
  const project = options._commandParameters.project.replace(/"/g, '');
  const destination = options._commandParameters.destinationfolder.replace(/"/g, '');
  return project + destination;
}

type ObjectImportOptions = {
  _commandFlags: unknown[];
  _status: string;
  _commandParameters: {
    authid: string;
    destinationfolder: string;
    project: string;
    scriptid: string;
    type: string;
  };
  _data: {
    errorImports: unknown[];
    failedImpots: unknown[];
    successfulImports: Array<{
      customObject: {
        id: string;
        result: {
          code: string;
        };
        type: string;
      };
      referencedFileImportResult: {
        failedImports: unknown[];
        successfulImports: unknown[];
      };
    }>;
  };
};

export { organizeImportedObjects };
