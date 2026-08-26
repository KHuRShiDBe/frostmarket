/** Standard Russian pluralization: one/few/many by the last one-or-two digits. */
export function ruPlural(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
  return many;
}

export function enPlural(n: number, singular: string, plural: string): string {
  return n === 1 ? singular : plural;
}
