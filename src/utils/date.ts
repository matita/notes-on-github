export const addDays = (date: Date, days: number) => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
};

export const getDateFromTemplate = (template:string, text:string):Date => {
  const regexPattern = template
    .replace('{YYYY}', '(?<year>\\d{4})')
    .replace('{MM}', '(?<month>\\d{2})')
    .replace('{DD}', '(?<day>\\d{2})');
  const regex = new RegExp(regexPattern);

  const match = text.match(regex);
  if (!match || !match.groups) {
    return new Date();
  }

  const { year, month, day } = match.groups;
  return new Date(`${year}-${month}-${day}`);
}

export const parseDate = (text:string, baseDate:Date = new Date()):Date => {
  const dateMatch = text.match(/(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/);
  const timeMatch = text.match(/(?<hours>\d\d?):(?<minutes>\d\d?)(?::(?<seconds>\d\d?))?/);
  const date = new Date(baseDate);

  if (dateMatch && (!timeMatch || (timeMatch.index && dateMatch.index && timeMatch.index > dateMatch.index))) {
    if (dateMatch.groups?.year) {
      date.setFullYear(+dateMatch.groups?.year);
    }
    if (dateMatch.groups?.month) {
      date.setMonth((+dateMatch.groups?.month) - 1);
    }
    if (dateMatch.groups?.day) {
      date.setDate(+dateMatch.groups?.day);
    }
  }

  if (timeMatch) {
    date.setHours(+(timeMatch?.groups?.hours ?? 0));
    date.setMinutes(+(timeMatch?.groups?.minutes ?? 0));
    date.setSeconds(+(timeMatch?.groups?.seconds ?? 0));
  }
  
  return date;
}

const pad = (num: number) => ('0' + num).slice(-2);

export const formatDateAndTime = (date: Date) => {
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    ' ' +
    `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
  );
}