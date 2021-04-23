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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
exports.__esModule = true;
var child_process_1 = require("child_process");
var path_1 = require("path");
var chalk = require("chalk");
var fs_1 = require("fs");
var log = console.log;
var npmCommand = process.platform == "win32" ? "npm.cmd" : "npm";
var firebaseCommand = process.platform == "win32" ? "firebase.cmd" : "firebase";
var setupFirebaseConfig = function () { return __awaiter(void 0, void 0, void 0, function () {
    var firebaseConfigFilePath, checkFileEmpty, firebaseSpawn;
    return __generator(this, function (_a) {
        firebaseConfigFilePath = path_1.resolve(__dirname, "../", "src", "config", "firebase.config.ts");
        checkFileEmpty = fs_1.readFileSync(firebaseConfigFilePath, {
            encoding: "utf8"
        });
        if (checkFileEmpty.length <= 0) {
            firebaseSpawn = child_process_1.spawn(firebaseCommand, ["apps:sdkconfig"]);
            firebaseSpawn.stdout.on("data", function (chunk) {
                var stringManipulation = "" + chunk.toString().split("initializeApp(")[1].split(");")[0];
                var parsedData = JSON.parse(stringManipulation);
                var stringToWrite = "export default " + JSON.stringify(parsedData);
                fs_1.writeFile(firebaseConfigFilePath, stringToWrite, function () {
                    console.log("Config file was created successfully");
                });
            });
        }
        else {
            console.log("File is already populated");
        }
        return [2 /*return*/];
    });
}); };
setupFirebaseConfig();
var runTerminalCommand = function (spawnArgs, chalkConfig, processName) {
    var _a, _b;
    var terminalCommand = child_process_1.spawn(spawnArgs.command, __spreadArray([], spawnArgs.args), spawnArgs.options);
    var chalkedLog = chalk
        .hex(chalkConfig.color_hex)
        .bgHex(chalkConfig.bg_color_hex);
    (_a = terminalCommand.stdout) === null || _a === void 0 ? void 0 : _a.on("data", function (chunk) {
        log(chalkedLog(processName + ":"), chunk.toString());
    });
    (_b = terminalCommand.stderr) === null || _b === void 0 ? void 0 : _b.on("data", function (chunk) {
        log(chalkedLog(processName + " ERROR:"), chalk.bgRedBright.bold.whiteBright("" + chunk));
    });
    terminalCommand.on("close", function (code) {
        log(chalkedLog(processName + ":"), chalk.bgRedBright.bold.whiteBright("Exited with code: " + code));
    });
};
runTerminalCommand({
    command: npmCommand,
    args: ["run", "emulators"],
    options: { cwd: process.cwd() }
}, { bg_color_hex: "#0F2027", color_hex: "#FCCA3F" }, "Firebase emulator");
runTerminalCommand({
    command: npmCommand,
    args: ["run", "dev"],
    options: { cwd: process.cwd() }
}, { bg_color_hex: "#2B2E3B", color_hex: "#9FEAF9" }, "React scripts");
runTerminalCommand({
    command: "tsc",
    args: ["--watch"],
    options: { cwd: path_1.resolve(process.cwd(), "functions"), shell: true }
}, { bg_color_hex: "#007ACC", color_hex: "#FFFFFF" }, "Typescript cloud functions compilation");
