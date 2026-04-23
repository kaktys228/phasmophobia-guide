export function splitGhostName(name: string) {
  const match = name.match(/^(.*?)\s*\((.*?)\)\s*$/);

  if (!match) {
    return {
      primaryName: name,
      secondaryName: null,
    };
  }

  return {
    primaryName: match[1].trim(),
    secondaryName: match[2].trim(),
  };
}
