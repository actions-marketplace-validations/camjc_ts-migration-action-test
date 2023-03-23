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
const core_1 = __importDefault(require("@actions/core"));
const fs = require('fs').promises;
const path_1 = __importDefault(require("path"));
function getAllFilenames(dirPath, fileArr) {
    return __awaiter(this, void 0, void 0, function* () {
        const files = yield fs.readdir(dirPath);
        for (const file of files) {
            const filePath = path_1.default.join(dirPath, file);
            const stats = yield fs.stat(filePath);
            if (stats.isDirectory()) {
                yield getAllFilenames(filePath, fileArr);
            }
            else {
                fileArr.push(filePath);
            }
        }
        return fileArr;
    });
}
function countByExtension(filenames) {
    return filenames.reduce((counts, filename) => {
        const extension = filename.split('.').pop() || '';
        return Object.assign(Object.assign({}, counts), { [extension]: (counts[extension] || 0) + 1 });
    }, {});
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const myInput = core_1.default.getInput('myInput');
            core_1.default.debug(`Hello ${myInput} from inside a container`);
            const arrayOfFiles = [];
            getAllFilenames(process.env.GITHUB_WORKSPACE || '/', arrayOfFiles);
            core_1.default.setOutput('countsByExtension', countByExtension(arrayOfFiles));
        }
        catch (error) {
            core_1.default.setFailed(error.message);
        }
    });
}
run();
