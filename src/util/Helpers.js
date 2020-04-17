export function formatDate(dateString) {
  const date = new Date(dateString);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  return monthNames[monthIndex] + " " + year;
}

export function formatDateTime(dateTimeString) {
  const date = new Date(dateTimeString);

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  return (
    date.getDate() +
    " " +
    monthNames[monthIndex] +
    " " +
    year +
    " - " +
    date.getHours() +
    ":" +
    date.getMinutes()
  );
}

export function ISOFormatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;
  return [year, month, day].join("-");
}

export function DotFormatDate(type, date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  var out = "";
  if (type === "MONTH") {
    out = [month, year].join(".");
  } else if (type === "DAY") {
    out = [day, month, year].join(".");
  }
  return out;
}

export function PrevMonthDate(date) {
  var d = new Date(date);
  var newMonth = d.getMonth() - 1;
  if (newMonth < 0) {
    newMonth += 12;
    d.setYear(d.getFullYear() - 1);
  }
  d.setMonth(newMonth);
  return d;
}

export function CalFirstDay(type, date) {
  var d = new Date(date);
  if (type === "DAY") {
    d.setDate(d.getDate() - 30);
  } else if (type === "MONTH") {
    d.setDate("01");
    d.setMonth((d.getMonth() + 1) % 12);
    d.setYear(d.getFullYear() - 1);
  }
  return d;
}

export function nextDay(date) {
  var d = new Date(date);
  d.setDate(d.getDate() + 1);
  return d;
}

export function prevDay(date) {
  var d = new Date(date);
  d.setDate(d.getDate() - 1);
  return d;
}

export function nextMonth(date) {
  var d = new Date(date);
  var newMonth = d.getMonth() + 1;
  if (newMonth == 12) {
    newMonth = 0;
    d.setYear(d.getFullYear() + 1);
  }
  d.setMonth(newMonth);
  return d;
}
