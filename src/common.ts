export function matchesPatterns(str:string, all?: RegExp[], oneOf?: RegExp[]): boolean {
  return (!all || all?.every((reg) => {
    return str.match(reg);
  })) && (!oneOf || oneOf?.some((reg) => {
    return str.match(reg);
  }));
}