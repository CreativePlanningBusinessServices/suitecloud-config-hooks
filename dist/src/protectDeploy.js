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
Object.defineProperty(exports, "__esModule", { value: true });
exports.isProd = exports.preventDeployWithUncommittedChanges = exports.preventDeployWithoutRemote = void 0;
const child_process_1 = require("child_process");
const process_1 = require("process");
function preventDeployWithoutRemote(options) {
    return __awaiter(this, void 0, void 0, function* () {
        if (yield hasRemote(options.projectPath)) {
            return options;
        }
        throw new Error('You cannot deploy code from a branch which does not have a remote. Please push this branch.');
    });
}
exports.preventDeployWithoutRemote = preventDeployWithoutRemote;
function preventDeployWithUncommittedChanges(options) {
    return __awaiter(this, void 0, void 0, function* () {
        if ((yield hasUncommittedChanges(options.projectPath)) || (yield hasUnpushedChanges(options.projectPath))) {
            throw new Error('You cannot deploy to a production account from a branch with uncommitted changes. Please commit and push all changes on this branch.');
        }
        return options;
    });
}
exports.preventDeployWithUncommittedChanges = preventDeployWithUncommittedChanges;
function isProd(options) {
    const authId = options.arguments.authid.trim();
    const isDigitsOnly = !isNaN(Number(authId));
    return isDigitsOnly;
}
exports.isProd = isProd;
function shell(command) {
    return new Promise((resolve, reject) => {
        (0, child_process_1.exec)(command, (_, stdout, stderr) => {
            if (stderr.length > 1) {
                return reject(stderr);
            }
            return resolve(stdout);
        });
    });
}
function withDirectory(directory, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        const currentDirectory = (0, process_1.cwd)();
        (0, process_1.chdir)(directory);
        const result = yield fn();
        (0, process_1.chdir)(currentDirectory);
        return result;
    });
}
function hasRemote(directory) {
    return __awaiter(this, void 0, void 0, function* () {
        const output = yield withDirectory(directory, () => __awaiter(this, void 0, void 0, function* () {
            return yield shell(`git for-each-ref --format='%(upstream:short)' "$(git symbolic-ref -q HEAD)"`);
        }));
        return output.trim().length > 0;
    });
}
function hasUncommittedChanges(directory) {
    return __awaiter(this, void 0, void 0, function* () {
        const output = yield withDirectory(directory, () => __awaiter(this, void 0, void 0, function* () {
            return yield shell(`git status -s`);
        }));
        return output.trim().length > 0;
    });
}
function hasUnpushedChanges(directory) {
    return __awaiter(this, void 0, void 0, function* () {
        const output = yield withDirectory(directory, () => __awaiter(this, void 0, void 0, function* () {
            return yield shell(`git cherry -v`);
        }));
        return output.trim().length > 0;
    });
}
