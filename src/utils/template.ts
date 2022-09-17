const pad = (n:string|number) => `0${n}`.slice(-2);

export const format = (template:string, date:Date = new Date()):string => {
  return template
    .replace(/{YYYY}/g, () => '' + date.getFullYear())
    .replace(/{MM}/g, () => pad(date.getMonth() + 1))
    .replace(/{DD}/g, () => pad(date.getDate()))
    .replace(/{hh}/g, () => pad(date.getHours()))
    .replace(/{mm}/g, () => pad(date.getMinutes()))
    .replace(/{ss}/g, () => pad(date.getSeconds()));
};