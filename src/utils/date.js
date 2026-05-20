const TZ = 'Asia/Singapore';

export function todaySG() {
  return new Date().toLocaleDateString('en-CA', { timeZone: TZ });
}

export function nowSG() {
  const str = new Date().toLocaleDateString('en-CA', { timeZone: TZ });
  const [year, month] = str.split('-').map(Number);
  return { month, year };
}
