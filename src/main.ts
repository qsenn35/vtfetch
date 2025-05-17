import { logHelp, parse } from "./args.ts";
import { init } from "./config.ts";
import { open } from "./kv.ts";
import logs from "./logs.ts";

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
  console.log(config);
}

await main();