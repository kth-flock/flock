const time = (d: string | Date) => new Date(d).getTime();

export const byOldest = <T extends { createdAt: string | Date }>(a: T, b: T) =>
  time(a.createdAt) - time(b.createdAt);

export const byNewest = <T extends { createdAt: string | Date }>(a: T, b: T) =>
  byOldest(b, a);
