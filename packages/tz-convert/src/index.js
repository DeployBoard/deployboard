// take an ISO string and return a date string as Month text, day, year, hour, minute, second am/pm
export const tzConvert = (date, timezone) => {
  // if no timezone is provided, use the browser's timezone
  const tz = timezone || "default";
  const d = new Date(date);
  const month = d.toLocaleString(tz, { month: "short" });
  const day = d.getDate();
  const year = d.getFullYear();
  const hour = d.getHours();
  const minute = (d.getMinutes() < 10 ? "0" : "") + d.getMinutes();
  // const second = (d.getSeconds() < 10 ? "0" : "") + d.getSeconds();
  const ampm = hour >= 12 ? "pm" : "am";
  const ampmHour = hour % 12;
  const ampmHourFinal = ampmHour === 0 ? 12 : ampmHour;
  return `${month} ${day}, ${year} ${ampmHourFinal}:${minute} ${ampm}`;
};
