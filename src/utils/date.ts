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