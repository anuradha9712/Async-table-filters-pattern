const getTimeDifference = (created_date) => {
  const curr_date = new Date();

  // get total seconds between the times
  let delta = Math.abs(curr_date - created_date) / 1000;

  // calculate (and subtract) whole days
  let days = Math.floor(delta / 86400);
  delta -= days * 86400;

  // calculate (and subtract) whole hours
  let hours = Math.floor(delta / 3600) % 24;
  delta -= hours * 3600;

  // calculate (and subtract) whole minutes
  let minutes = Math.floor(delta / 60) % 60;
  delta -= minutes * 60;

  // remaining value is consider as seconds
  let seconds = delta % 60;

  return { days, hours, minutes, seconds };
};

const dayHandler = (days, fullDate) => {
  switch (true) {
    case days > 7:
      return fullDate;
    case days === 7:
      return "1 week ago";
    case days === 1:
      return "yesterday";
    default:
      return `${days} days ago`;
  }
};

const hourHandler = (hour) => {
  return hour === 1 ? "1 hr ago" : `${hour} hrs ago`;
};

const minHandler = (min) => {
  return min === 1 ? "1 min ago" : `${min} mins ago`;
};

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

export const getDisplayDate = (created_date) => {
  let month = monthNames[created_date.getUTCMonth()];
  let date = ("0" + created_date.getUTCDate()).slice(-2);
  let year = created_date.getUTCFullYear();

  let { days, hours, minutes } = getTimeDifference(created_date);
  const fullDate = month + " " + date + ", " + year;

  let displayDate = "just now";
  if (days) {
    displayDate = dayHandler(days, fullDate);
  } else if (hours) {
    displayDate = hourHandler(hours);
  } else if (minutes) {
    displayDate = minHandler(minutes);
  }
  return { displayDate, fullDate };
};
