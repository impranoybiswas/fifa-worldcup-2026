export function customBanglaTime(dateString: string): { dateStr: string; timeStr: string } {
  const date = new Date(dateString);

  const hour = date.getHours();
  if (hour >= 0 && hour < 4) {
    date.setDate(date.getDate() - 1);
  }

  const dateStr = date.toLocaleDateString("bn-BD", {
    month: "long",
    day: "numeric",
    timeZone: "Asia/Dhaka",
    calendar: "bengali",
  });

  let timeStr = date.toLocaleTimeString("bn-BD", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    dayPeriod: "short",
    timeZone: "Asia/Dhaka",
    calendar: "bengali",
  });

  if (timeStr.includes("রাত্রি")) {
    timeStr = timeStr.replace("রাত্রি", "রাত");
  }

  return { dateStr, timeStr };
}
