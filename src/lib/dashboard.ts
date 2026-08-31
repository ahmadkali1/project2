export function getDashboardHeader(date = new Date()) {
  const hour = date.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const eyebrow = new Intl.DateTimeFormat("en", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(date).replace(",", " ·");

  return { greeting, eyebrow };
}
