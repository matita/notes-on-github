const pad = (n:string|number) => `0${n}`.slice(-2);

export const format = (template:string):string => {
  const now = new Date();
  return template
    .replace('{YYYY}', () => '' + now.getFullYear())
    .replace('{MM}', () => pad(now.getMonth() + 1))
    .replace('{DD}', () => pad(now.getDate()))
    .replace('{hh}', () => pad(now.getHours()))
    .replace('{mm}', () => pad(now.getMinutes()))
    .replace('{ss}', () => pad(now.getSeconds()));
};