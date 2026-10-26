import { useState, useEffect } from 'react';

export function usePhilippineTime() {
  const [timeString, setTimeString] = useState<string>(() => formatTime(new Date()));

  useEffect(() => {
    const update = () => setTimeString(formatTime(new Date()));
    const timer = setInterval(update, 10000);
    return () => clearInterval(timer);
  }, []);

  return { timeString };
}

function formatTime(date: Date): string {
  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Manila',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  } catch {
    // Fallback if environment lacks Intl timezone support
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }
}
