const banglaDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("bn-BD", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Dhaka",
    calendar: "bengali",
  });
};

const banglaTime = (dateString: string): string => {
  const date = new Date(dateString);

  const time = date.toLocaleTimeString("bn-BD", {
    hour: "numeric",
    hour12: true,
    minute: "numeric",
    dayPeriod: "short",
    timeZone: "Asia/Dhaka",
    calendar: "bengali",
  });

  //change রাত্রি to রাত
  if (time.includes("রাত্রি")) {
    return time.replace("রাত্রি", "রাত").split(" ").reverse().join(" ");
  }

  return time.split(" ").reverse().join(" ");
};

export { banglaDate, banglaTime };
