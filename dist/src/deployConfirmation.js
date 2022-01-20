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
exports.deployConfirmation = void 0;
const child_process_1 = require("child_process");
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
function deployConfirmation(options) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(options);
        const input = yield getInput('Enter \\"Deploy\\" to confirm project deployment');
        if (input !== 'Deploy') {
            throw Error('Invalid confirmation text entered');
        }
        return options;
    });
}
exports.deployConfirmation = deployConfirmation;
function getInput(question) {
    const executablePath = getExecuteablePath();
    return new Promise((resolve, reject) => {
        (0, child_process_1.exec)(`${executablePath} "${question}"`, (error, stdout) => {
            if (error) {
                reject(error);
            }
            resolve(stdout.trim());
        });
    });
}
function getExecuteablePath() {
    if (os_1.default.platform() === 'win32') {
        return path_1.default.join(__dirname, 'deploy-confirmation-win.exe');
    }
    return path_1.default.join(__dirname, 'deploy-confirmation-macos');
}
