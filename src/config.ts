import logs, { infoRGB, errorRGB } from "./logs.ts";

export type ConfigKey = "voltaicName" | "apiUrl" | "aimtrainer" | "skilltier";
export const AimtrainerTypes = [ "kovaaks", "aimlabs" ];
export const SkillTierTypes = [ "novice", "intermediate", "advanced" ];


export const ConfigSchema: {
  [key in ConfigKey]: {
    prompt?: string;
    options?: string[];
    required: boolean;
  };
} = {
  voltaicName: {
    prompt: logs.rgb(infoRGB, "Enter your Voltaic username"),
    required: true,
  },
  apiUrl: { required: true },
  aimtrainer: {
    prompt: logs.rgb(infoRGB, "Enter your Voltaic username"),
    options: AimtrainerTypes,
    required: true,
  },
  skilltier: {
    prompt: logs.rgb(infoRGB, "Enter your Voltaic username"),
    options: SkillTierTypes,
    required: true,
  },
};

export type Config = {
  [key in ConfigKey]: string | number | null;
};

export const DefaultConfig: Config = {
  voltaicName: null,
  apiUrl: "https://beta.voltaic.gg/api",
  aimtrainer: "kovaaks",
  skilltier: "novice",
};

function promptForValue(message: string, key: ConfigKey, config: Config) {
  const schema = ConfigSchema[key];
  const schemaOptions = schema.options || [];
  const hasOptions = !!schemaOptions && schemaOptions.length;
  let promptMessage = `${message}:`;

  // if we have options, display the valid options below the prompt message
  if (hasOptions) {
    promptMessage = `${message} (${schema.options || [].join(", ")}):`;
  }
  
  const data = prompt(promptMessage);

  if (!data || !data.length) {
    logs.error(`Missing ${key}!`);
    return promptForValue(message, key, config);
  }

  // if we have specified options, ensure the user chose a valid option
  if (hasOptions) {
    if (!schemaOptions.includes(data.trim().toLocaleLowerCase())) {
      logs.error("Invalid Option provided");
      return promptForValue(message, key, config);
    }
  }

  config[key] = data.trim().toLocaleLowerCase();

  return data;
}

export async function setupNewConfig(db: any) {
  const newConfig = DefaultConfig;

  for (const [key, schema] of Object.entries(ConfigSchema)) {
    if (schema.prompt)
      promptForValue(schema.prompt, key as ConfigKey, newConfig);
  }

  await db.setConfig(newConfig);

  return newConfig;
}

export async function init(db: any) {
  const { value: currentConfig } = await db.getConfig();

  // ensure config is set on first run
  if (!currentConfig) {
    const newConfig = await setupNewConfig(db);
    return newConfig;
  }

  // ensure each required config property is set
  for (const [key, schema] of Object.entries(ConfigSchema)) {
    const value = currentConfig[key];

    // prompt for value if missing required value
    if ((schema.required && !value) || !(value as string).length) {
      if (schema.prompt) {
        promptForValue(schema.prompt, key as ConfigKey, currentConfig);
        // update config with new value
        db.setConfig(currentConfig);
      }
    }
  }

  return currentConfig;
}
