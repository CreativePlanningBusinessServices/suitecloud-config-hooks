import { access, mkdir, opendir, rename } from 'fs/promises';
import path from 'path';

async function organizeImportedObjects(options: ObjectImportOptions): Promise<void> {
  const objectDirectoryPath = getObjectDirectoryPath(options);
  const fileNames = await fetchUnorganizedFileNames(objectDirectoryPath);
  for (const name of fileNames) {
    await moveFile(name, objectDirectoryPath);
  }
}

async function moveFile(fileName: string, directoryPath: string) {
  const oldPath = directoryPath + path.sep + fileName;
  const relativeFolderPath = getRelativeFolderPath(fileName);
  const newFolderPath = directoryPath + path.sep + relativeFolderPath.join(path.sep);
  await createFolder(directoryPath, relativeFolderPath);
  const newPath = newFolderPath + path.sep + fileName;
  rename(oldPath, newPath);
}

async function createFolder(directoryPath: string, relativeFolderPath: string[]): Promise<void> {
  for (const pathComponent of relativeFolderPath) {
    directoryPath += path.sep + pathComponent;
    if (!(await doesFolderExist(directoryPath))) {
      await mkdir(directoryPath);
    }
  }
}

async function doesFolderExist(directoryPath: string): Promise<boolean> {
  try {
    await access(directoryPath);
    return true;
  } catch {
    return false;
  }
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

function getRelativeFolderPath(fileName: string): string[] {
  for (const [prefix, folderPath] of Object.entries(filePrefixFolderMap)) {
    if (fileName.startsWith(prefix)) {
      return folderPath;
    }
  }
  throw new Error(`file name ${fileName} could not be resolved to a folder`);
}

const filePrefixFolderMap = {
  custtmpl: ['Templates', 'AdvancedPDFs'],
};

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
