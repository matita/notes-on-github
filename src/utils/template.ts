const pad = (n:string|number) => `0${n}`.slice(-2);

export const format = (template:string):string => {
  const now = new Date();
  return template
    .replace(/{YYYY}/g, () => '' + now.getFullYear())
    .replace(/{MM}/g, () => pad(now.getMonth() + 1))
    .replace(/{DD}/g, () => pad(now.getDate()))
    .replace(/{hh}/g, () => pad(now.getHours()))
    .replace(/{mm}/g, () => pad(now.getMinutes()))
    .replace(/{ss}/g, () => pad(now.getSeconds()));
};