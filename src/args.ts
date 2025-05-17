import { parseArgs } from "jsr:@std/cli/parse-args";
import { AimtrainerTypes, SkillTierTypes } from "./config.ts";
import logs from "./logs.ts";

export const CLIBooleanOptions = [ "help", "reset-config" ];
export const CLIStringOptions = [ "voltaicName", "apiUrl", "aimtrainer", "skillTier" ];

export function parse() {
    const args = parseArgs(Deno.args, {
        boolean: CLIBooleanOptions,
        string: CLIStringOptions,
        alias: {
            help: "h",
        },
    });

    return args;
}

function rightPad(str: string, length: number, padChar = ' ') {
    str = String(str); // ensure it's a string
    if (str.length >= length) return str;
    const padLength = length - str.length;
    return str + padChar.repeat(padLength);
  }
  

export function logHelp() {
    const options = [...CLIBooleanOptions, ...CLIStringOptions].map((opt) => `--${opt}`);
    const descriptions = [
        "Display command usage and options",
        "Reset the config completely and begins the setup process",
        "Sets the Voltaic Username in the config.",
        "Sets the Voltaic API Base URL in the config.",
        `Sets the desired aimtrainer to track through voltaic. Valid Options: ${AimtrainerTypes.join(", ")}`,
        `Sets the desired Skill Tier to track through voltaic. Valid Options: ${SkillTierTypes.join(", ")}`,
    ]
    const fullOptions = options.map((opt, index) => {
        return {
            option: opt,
            description: descriptions[index] || "",
        }
    });

    console.group("\nCommand Usage:");
    console.log(`voltfetch: --[${[...CLIBooleanOptions].join(" | ")}]`);
    console.log(`voltfetch: --[${[...CLIStringOptions].join(" | ")}]=VALUE`);
    console.groupEnd();

    console.group("\nOptions:")
    fullOptions.forEach((opt) => {
        console.log(rightPad(opt.option, 16), "\t", opt.description)
    });
}
