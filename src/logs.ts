export type Rgb = {
  r: number,
  g: number,
  b: number,
}

export const infoRGB = {
  r: 187,
  g: 207,
  b: 255,
}

export const errorRGB = {
  r: 224,
  g: 93,
  b: 93,
}

const rgb = ({ r, g, b }: Rgb, text: string) =>
  `\x1b[38;2;${r};${g};${b}m${text}\x1b[0m`;

function error(...messages: string[]) {
  console.log(rgb(errorRGB, messages.join(" ")));
}

function info(...messages: string[]) {
  console.log(rgb(infoRGB, messages.join(" ")));
}

function chart(data: {
  [key: string]: number,
}) {
  const maxLabelLength = Math.max(...Object.keys(data).map(k => k.length));
  const maxValue = Math.max(...Object.values(data));
  const scale = 50 / maxValue;

  for (const [key, value] of Object.entries(data)) {
    const paddedLabel = key.padEnd(maxLabelLength);
    const bar = '█'.repeat(Math.round(value * scale));
    console.log(`${paddedLabel} | ${rgb(infoRGB, bar)} ${value}`);
  }
}

export default {
  rgb,
  info,
  error,
  chart,
}