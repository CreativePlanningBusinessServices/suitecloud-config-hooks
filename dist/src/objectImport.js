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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.organizeImportedObjects = void 0;
const promises_1 = require("fs/promises");
function organizeImportedObjects(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const objectDirectoryPath = getObjectDirectoryPath(options);
        const fileNames = yield fetchUnorganizedFileNames(objectDirectoryPath);
        for (const name of fileNames) {
            yield moveFile(name, objectDirectoryPath);
        }
    });
}
exports.organizeImportedObjects = organizeImportedObjects;
function moveFile(fileName, directoryPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const oldPath = `${directoryPath}/${fileName}`;
        const newFolderPath = `${directoryPath}/${getFolderName(fileName)}`;
        if (!(yield doesFolderExist(newFolderPath))) {
            yield (0, promises_1.mkdir)(newFolderPath);
        }
        const newPath = `${newFolderPath}/${fileName}`;
        (0, promises_1.rename)(oldPath, newPath);
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
function getFolderName(fileName) {
    return 'Test'; //TODO:
}
function fetchUnorganizedFileNames(directoryPath) {
    var e_1, _a;
    return __awaiter(this, void 0, void 0, function* () {
        const fileNames = [];
        const directory = yield (0, promises_1.opendir)(directoryPath);
        try {
            for (var directory_1 = __asyncValues(directory), directory_1_1; directory_1_1 = yield directory_1.next(), !directory_1_1.done;) {
                const entry = directory_1_1.value;
                if (entry.isFile()) {
                    fileNames.push(entry.name);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (directory_1_1 && !directory_1_1.done && (_a = directory_1.return)) yield _a.call(directory_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return fileNames;
    });
}
function getObjectDirectoryPath(options) {
    const project = options._commandParameters.project.replace(/"/g, '');
    const destination = options._commandParameters.destinationfolder.replace(/"/g, '');
    return project + destination;
}
