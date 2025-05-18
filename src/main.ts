import { logHelp, parse } from "./args.ts";
import { Config, init } from "./config.ts";
import { open } from "./kv.ts";
import logs from "./logs.ts";
import { getKovaaksData } from "./voltaic.ts";

async function handleKovaaks(config: Config) {
  try {
    const data = await getKovaaksData(config);
    return data;
  } catch(error) {
    logs.error((error as Error).message);
    return null;
  }
}

async function handleAimlabs(_config: Config) {
  throw new Error("Aimlabs support not implemented yet!");
}

async function main() {
  logs.chart({
    test: 10,
    anotherTest: 20,
    yetAnotherTest: 30,
  });
  const db = await open();
  const args = parse();

  if (args["help"] || args["h"]) return logHelp();
  if (args["reset-config"]) db.clearConfig();

  const config = await init(db);
  const getVoltaicData = config.aimtrainer === "kovaaks" ? handleKovaaks : handleAimlabs;
  const voltaicData = await getVoltaicData(config);

  if (voltaicData)
    console.log(voltaicData);
}

await main();