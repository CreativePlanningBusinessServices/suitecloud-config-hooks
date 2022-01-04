"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.organizeImportedObjects = void 0;
const promises_1 = require("fs/promises");
const path_1 = __importDefault(require("path"));
function organizeImportedObjects(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const objectDirectoryPath = getObjectDirectoryPath(options);
        console.log(options._data.successfulImports);
        yield moveImportedFiles(options, objectDirectoryPath);
    });
}
exports.organizeImportedObjects = organizeImportedObjects;
function moveImportedFiles(options, objectDirectoryPath) {
    return __awaiter(this, void 0, void 0, function* () {
        for (const successfulImport of options._data.successfulImports) {
            const { id, type } = successfulImport.customObject;
            try {
                if (type === 'advancedpdftemplate') {
                    yield moveFile(id + '.template.xml', type, objectDirectoryPath);
                }
                yield moveFile(id + '.xml', type, objectDirectoryPath);
            }
            catch (err) {
                console.error(err);
            }
        }
    });
}
function moveFile(fileName, fileType, directoryPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const oldPath = directoryPath + path_1.default.sep + fileName;
        const relativeFolderPath = getRelativeFolderPath(fileType);
        const newFolderPath = directoryPath + path_1.default.sep + relativeFolderPath.join(path_1.default.sep);
        yield createFolder(directoryPath, relativeFolderPath);
        const newPath = newFolderPath + path_1.default.sep + fileName;
        yield (0, promises_1.rename)(oldPath, newPath);
    });
}
function createFolder(directoryPath, relativeFolderPath) {
    return __awaiter(this, void 0, void 0, function* () {
        for (const pathComponent of relativeFolderPath) {
            directoryPath += path_1.default.sep + pathComponent;
            if (!(yield doesFolderExist(directoryPath))) {
                yield (0, promises_1.mkdir)(directoryPath);
            }
        }
    });
}
function doesFolderExist(directoryPath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, promises_1.access)(directoryPath);
            return true;
        }
        catch (_a) {
            return false;
        }
    });
}
function getObjectDirectoryPath(options) {
    const project = options._commandParameters.project.replace(/"/g, '');
    const destination = options._commandParameters.destinationfolder.replace(/"/g, '');
    return project + destination;
}
function getRelativeFolderPath(fileType) {
    const path = filePrefixFolderMap[fileType];
    if (!path) {
        throw new Error(`file type ${fileType} could not be resolved to a folder`);
    }
    return path;
}
// TODO:
const filePrefixFolderMap = {
    advancedpdftemplate: ['Templates', 'AdvancedPDFs'],
    center: ['CentersAndTabs', 'Centers'],
    custcentercategory: ['CentersAndTabs', 'Categories'],
    custcentertab: ['CentersAndTabs', 'Tab'],
};
