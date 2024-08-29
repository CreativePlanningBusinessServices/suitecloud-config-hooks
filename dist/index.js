"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isProd = exports.preventDeployWithoutRemote = exports.preventDeployWithUncommittedChanges = exports.organizeImportedObjects = void 0;
const objectImport_1 = require("./src/objectImport");
Object.defineProperty(exports, "organizeImportedObjects", { enumerable: true, get: function () { return objectImport_1.organizeImportedObjects; } });
const protectDeploy_1 = require("./src/protectDeploy");
Object.defineProperty(exports, "isProd", { enumerable: true, get: function () { return protectDeploy_1.isProd; } });
Object.defineProperty(exports, "preventDeployWithoutRemote", { enumerable: true, get: function () { return protectDeploy_1.preventDeployWithoutRemote; } });
Object.defineProperty(exports, "preventDeployWithUncommittedChanges", { enumerable: true, get: function () { return protectDeploy_1.preventDeployWithUncommittedChanges; } });
