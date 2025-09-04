export function GetCurrentDaytime(messages = {}) {
  const defaultMessages = {
    night: "Lofi Night's 💫",
    morning: "Morning Vibes ✨",
    afternoon: "Afternoon Vibes ✨",
    evening: "Evening Chill's ✨",
  };

  const mergedMessages = { ...defaultMessages, ...messages };
  const hour = new Date().getHours();

  if (hour >= 21 || hour <= 3) { return mergedMessages.night; }
  if (hour >= 4 && hour <= 11) { return mergedMessages.morning; }
  if (hour >= 12 && hour <= 16) { return mergedMessages.afternoon; }
  if (hour >= 17 && hour <= 20) { return mergedMessages.evening; }

  return "Good Vibes ✨";
}
