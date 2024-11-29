export function env(key: string, defaultValue?: string) {
  const value = process.env[key] ?? defaultValue;

  if (!value) {
    throw `Required environment variable '${key}' not set`;
  }

  return value;
}
