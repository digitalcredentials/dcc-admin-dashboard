export const dedupe = <T>(array: T[]): T[] => [...new Set(array)];
