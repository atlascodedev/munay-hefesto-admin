import { SpawnOptions } from "node:child_process";

export interface SpawnArguments {
  command: string;
  args: string[];
  options: SpawnOptions;
}

export interface ChalkLogColors {
  color_hex: string;
  bg_color_hex: string;
}

export interface FirebaseSDKConfigJSON {
  status: string;
  result: {
    fileName: string;
    fileContents: string;
    sdkConfig: {
      projectId: string;
      appId: string;
      storageBucket: string;
      locationId: string;
      apiKey: string;
      authDomain: string;
      messagingSenderId: string;
      measurementId: string;
    };
  };
}

export interface FirebaseConfig {
  projectId: string;
  appId: string;
  storageBucket: string;
  locationId: string;
  apiKey: string;
  authDomain: string;
  messagingSenderId: string;
  measurementId: string;
}
