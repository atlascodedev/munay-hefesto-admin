import { spawn, SpawnOptions, ChildProcess, exec } from "child_process";
import { resolve, join } from "path";
import { tmpdir } from "os";
import * as chalk from "chalk";
import {
  existsSync,
  readFileSync,
  writeFileSync,
  readFile,
  writeFile,
} from "fs";
import {
  ChalkLogColors,
  FirebaseConfig,
  FirebaseSDKConfigJSON,
  SpawnArguments,
} from "./@types";

const log = console.log;

const npmCommand = process.platform == "win32" ? "npm.cmd" : "npm";
const firebaseCommand =
  process.platform == "win32" ? "firebase.cmd" : "firebase";

const setupFirebaseConfig = async () => {
  const firebaseConfigFilePath: string = resolve(
    __dirname,
    "../",
    "src",
    "config",
    "firebase.config.ts"
  );

  const checkFileEmpty = readFileSync(firebaseConfigFilePath, {
    encoding: "utf8",
  });

  if (checkFileEmpty.length <= 0) {
    const firebaseSpawn = spawn(firebaseCommand, ["apps:sdkconfig"]);

    firebaseSpawn.stdout.on("data", (chunk: Buffer) => {
      let stringManipulation: string = `${
        chunk.toString().split("initializeApp(")[1].split(");")[0]
      }`;

      let parsedData: FirebaseConfig = JSON.parse(stringManipulation);

      let stringToWrite: string = `export default ${JSON.stringify(
        parsedData
      )}`;

      writeFile(firebaseConfigFilePath, stringToWrite, () => {
        console.log("Config file was created successfully");
      });
    });
  } else {
    console.log("File is already populated");
  }
};

setupFirebaseConfig();

const runTerminalCommand = (
  spawnArgs: SpawnArguments,
  chalkConfig: ChalkLogColors,
  processName: string
) => {
  let terminalCommand: ChildProcess = spawn(
    spawnArgs.command,
    [...spawnArgs.args],
    spawnArgs.options
  );

  const chalkedLog = chalk
    .hex(chalkConfig.color_hex)
    .bgHex(chalkConfig.bg_color_hex);

  terminalCommand.stdout?.on("data", (chunk) => {
    log(chalkedLog(`${processName}:`), chunk.toString());
  });

  terminalCommand.stderr?.on("data", (chunk) => {
    log(
      chalkedLog(`${processName} ERROR:`),
      chalk.bgRedBright.bold.whiteBright(`${chunk}`)
    );
  });

  terminalCommand.on("close", (code) => {
    log(
      chalkedLog(`${processName}:`),
      chalk.bgRedBright.bold.whiteBright(`Exited with code: ${code}`)
    );
  });
};

runTerminalCommand(
  {
    command: npmCommand,
    args: ["run", "emulators"],
    options: { cwd: process.cwd() },
  },
  { bg_color_hex: "#0F2027", color_hex: "#FCCA3F" },
  "Firebase emulator"
);

runTerminalCommand(
  {
    command: npmCommand,
    args: ["run", "dev"],
    options: { cwd: process.cwd() },
  },
  { bg_color_hex: "#2B2E3B", color_hex: "#9FEAF9" },
  "React scripts"
);

runTerminalCommand(
  {
    command: "tsc",
    args: ["--watch"],
    options: { cwd: resolve(process.cwd(), "functions"), shell: true },
  },
  { bg_color_hex: "#007ACC", color_hex: "#FFFFFF" },
  "Typescript cloud functions compilation"
);
