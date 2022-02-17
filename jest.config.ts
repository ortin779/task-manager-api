import {Config} from "@jest/types";

export default async (): Promise<Config.InitialOptions> => {
  return {
    verbose: true,
    rootDir:"tests",
    modulePathIgnorePatterns:["<rootDir>/dist/","<rootDir>/node_modules"],
    moduleFileExtensions:["ts","tsx","js","jsx"]
  };
};