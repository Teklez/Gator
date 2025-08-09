import fs from "fs";
import os from "os";
import path from "path";
import { Config } from "./types";

export function setUser(currentUserName: string) {
  try {
    const configPath: string = path.join(os.homedir(), ".gatorconfig.json");
    const configData = fs.readFileSync(configPath, { encoding: "utf-8" });
    const parsed: Config | undefined = validateJson(configData);

    if (parsed) {
      parsed.currentUserName = currentUserName;
      fs.writeFileSync(
        configPath,
        JSON.stringify({
          db_url: parsed.dbUrl,
          current_user_name: parsed.currentUserName,
        })
      );
      console.log("The user has been set");
    }
  } catch (e) {
    console.log(`Error logging user ${currentUserName} in: ${e}`);
  }
}

export function readConfig(): Config | undefined {
  try {
    const configPath: string = path.join(os.homedir(), ".gatorconfig.json");
    const configData = fs.readFileSync(configPath, { encoding: "utf-8" });
    const parsed: Config | undefined = validateJson(configData);
    return parsed;
  } catch (e) {
    console.log(`Error while reading config file ${e}`);
  }
}

function validateJson(data: string): Config | undefined {
  try {
    const parsed = JSON.parse(data);
    return {
      dbUrl: parsed.db_url,
      currentUserName: parsed.current_user_name,
    };
  } catch (e) {
    console.log(`Error while parsing json ${e}`);
  }
}
