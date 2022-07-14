// take an ISO string and return a date string as Month text, day, year, hour, minute, second am/pm
const tzConvert = (date, timezone) => {
  // if no timezone is provided, use the browser's timezone
  const tz = timezone || "default";
  const d = new Date(date);
  const month = d.toLocaleString(tz, { month: "long" });
  const day = d.getDate();
  const year = d.getFullYear();
  const hour = d.getHours();
  const minute = d.getMinutes();
  const second = d.getSeconds();
  const ampm = hour >= 12 ? "pm" : "am";
  return `${month} ${day}, ${year} ${hour}:${minute} ${ampm}`;
};

module.exports = {
  tzConvert,
};
