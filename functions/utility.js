import { DateTime } from "luxon";

function formatDate(data) {
  const formattedDate = DateTime.fromJSDate(data);
  return formattedDate.toLocaleString();
}

function createImagePath(path) {
  if (!path) return null;
  return `${process.env.SERVER_URL}/images/${path}`;
}

export { formatDate, createImagePath };
