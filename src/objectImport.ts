import { opendir } from 'fs/promises';

async function organizeImportedObjects(options: ObjectImportOptions): Promise<void> {
  const objectDirectory = getObjectDirectory(options);
  const fileNames = await fetchUnorganizedFileNames(objectDirectory);
  console.log(fileNames);
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

function getObjectDirectory(options: ObjectImportOptions): string {
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
