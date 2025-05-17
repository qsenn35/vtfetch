import { Config } from "./config.ts";

export async function open() {
    const db = await Deno.openKv();

    return {
        async setConfig(config: Config) {
            await db.set(["config"], config);
        },
        async getConfig() {
            return await db.get(["config"]);
        },
        async clearConfig() {
            return await db.delete(["config"]);
        }
    };
}