export function convertUnixToDate(dt: number): string {
  const date = new Date(dt * 1000);
  return date.toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

export function convertUnixToHour(dt: number): string {
  const date = new Date(dt * 1000);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
