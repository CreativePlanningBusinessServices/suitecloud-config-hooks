import { access, mkdir, rename } from 'fs/promises';
import path from 'path';

async function organizeImportedObjects(options: ObjectImportOptions): Promise<void> {
  const objectDirectoryPath = getObjectDirectoryPath(options);
  console.log(options._data.successfulImports);
  await moveImportedFiles(options, objectDirectoryPath);
}

async function moveImportedFiles(options: ObjectImportOptions, objectDirectoryPath: string): Promise<void> {
  for (const successfulImport of options._data.successfulImports) {
    const { id, type } = successfulImport.customObject;
    try {
      await handleSpecialObjectTypes(id, type, objectDirectoryPath);
      await moveFile(id + '.xml', type, objectDirectoryPath);
    } catch (err) {
      console.error(err);
    }
  }
}

async function handleSpecialObjectTypes(id: string, type: string, objectDirectoryPath: string) {
  if (type === 'advancedpdftemplate') {
    await moveFile(id + '.template.xml', type, objectDirectoryPath);
  }
  if (type === 'emailtemplate') {
    await moveFile(id + '.template.html', type, objectDirectoryPath);
  }
}

async function moveFile(fileName: string, fileType: string, directoryPath: string): Promise<void> {
  const oldPath = directoryPath + path.sep + fileName;
  const relativeFolderPath = getRelativeFolderPath(fileType);
  const newFolderPath = directoryPath + path.sep + relativeFolderPath.join(path.sep);
  await createFolder(directoryPath, relativeFolderPath);
  const newPath = newFolderPath + path.sep + fileName;
  await rename(oldPath, newPath);
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

function getObjectDirectoryPath(options: ObjectImportOptions): string {
  const project = options._commandParameters.project.replace(/"/g, '');
  const destination = options._commandParameters.destinationfolder.replace(/"/g, '');
  return project + destination;
}

function getRelativeFolderPath(fileType: string): string[] {
  const path = filePrefixFolderMap[fileType];
  if (!path) {
    throw new Error(`file type ${fileType} could not be resolved to a folder`);
  }
  return path;
}

const filePrefixFolderMap: Record<string, string[]> = {
  addressform: ['Forms', 'AddressForms'],
  advancedpdftemplate: ['Templates', 'AdvancedPDFs'],
  bankstatementparserplugin: ['BankStatementParserPlugin'],
  bundleinstallationscript: ['BundleInstallation'],
  center: ['CentersAndTabs', 'Centers'],
  centercategory: ['CentersAndTabs', 'Categories'],
  centertab: ['CentersAndTabs', 'Tab'],
  centerlink: ['CentersAndTabs', 'Links'],
  clientscript: ['Scripts', 'Client'],
  cmscontenttype: ['CMS', 'ContentType'],
  crmcustomfield: ['Fields', 'CRM'],
  customglplugin: ['Plugins', 'Custom'],
  customlist: ['Lists'],
  customrecordtype: ['Records'],
  customsegment: ['CustomSegments'],
  customtransactiontype: ['CustomTransactions'],
  dataset: ['Dataset'],
  emailcaptureplugin: ['Plugins', 'Email'],
  emailtemplate: ['Templates', 'Email'],
  entitycustomfield: ['Fields', 'Entity'],
  entryForm: ['Forms', 'EntryForm'],
  integration: ['Integrations'],
  itemcustomfield: ['Fields', 'Item'],
  itemnumbercustomfield: ['Fields', 'ItemNumber'],
  itemoptioncustomfield: ['Fields', 'ItemOption'],
  kpiscorecard: ['KPIScorecards'],
  mapreducescript: ['Scripts', 'MapReduce'],
  massupdatescript: ['Scripts', 'MassUpdate'],
  othercustomfield: ['Fields', 'Other'],
  pluginimplementation: ['PluginImplementations'],
  plugintype: ['PluginTypes'],
  portlet: ['Scripts', 'Portlet'],
  promotionsplugin: ['Plugins', 'Promotions'],
  publisheddashboard: ['PublishDashboards'],
  restlet: ['Scripts', 'Restlet'],
  role: ['Roles'],
  csvimport: ['CSVImports'],
  savedsearch: ['SavedSearches'],
  scheduledscript: ['Scripts', 'Scheduled'],
  sdfinstallationscript: ['Scripts', 'SDFInstallation'],
  sspapplication: ['SSPApplications'],
  sublist: ['Sublists'],
  subtab: ['CentersAndTabs', 'SubTab'],
  suitelet: ['Scripts', 'Suitelet'],
  transactionForm: ['Forms', 'TransactionForm'],
  transactionbodycustomfield: ['Fields', 'TransactionBody'],
  transactioncolumncustomfield: ['Fields', 'TransactionColumn'],
  translationcollection: ['TranslationCollection'],
  usereventscript: ['Scripts', 'UserEvent'],
  workbook: ['Workbooks'],
  workflow: ['Workflows'],
  workflowactionscript: ['Scripts', 'WorkflowAction'],
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
