// voltaic profile data

import { Config } from "./config.ts";
import logs from "./logs.ts";

// kovaaks 
export async function getKovaaksSeasonBenchmarkData(config: Config) {
  try {
    const response = await fetch(`https://beta.voltaic.gg/api/v1/${config.aimtrainer}/benchmarks/${config.season}`);
    const json = await response.json();

    return json;
  } catch(error) {
    logs.error((error as Error).message);
    return null;
  }
}

// your scores KVKS
export async function getKovaaksProfileScores(config: Config) {
    try {
        const benchmarkId = "432"; // will change in future! might need to find a better way of doing this dynamically.
        const url = `https://kovaaks.com/webapp-backend/benchmarks/player-progress-rank-benchmark?benchmarkId=${benchmarkId}&steamId=${config.steamId}`;
        const response = await fetch(url);
        const json = await response.json();

        return json;
    } catch(error) {
        logs.error((error as Error).message);
        return null;
    }
}

export async function getKovaaksData(config: Config) {
  try {
    const benchmark = await getKovaaksSeasonBenchmarkData(config);
    const scores = await getKovaaksProfileScores(config);

    return {
      benchmark,
      scores,
    };
  } catch(error) {
    logs.error((error as Error).message);
    return null;
  }
}