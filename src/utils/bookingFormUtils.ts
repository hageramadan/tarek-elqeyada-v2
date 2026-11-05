import { format } from 'date-fns';

export const formatTimeTo12Hour = (time: string): string => {
  if (!time) return "";
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "م" : "ص";
  const hour12 = hours % 12 || 12;
  return `${hour12}:${String(minutes).padStart(2, "0")} ${period}`;
};

export const formatPhoneNumber = (phone: string, countryCode: string) => {
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  const phoneWithoutZero = cleanPhone.startsWith("0")
    ? cleanPhone.slice(1)
    : cleanPhone;
  return `${countryCode}${phoneWithoutZero}`;
};

export const filterAvailableTimes = (times: string[], dateStr: string): string[] => {
  if (!dateStr || times.length === 0) return times;

  const today = new Date();
  const todayStr = format(today, "yyyy-MM-dd");

  if (dateStr !== todayStr) return times;

  const now = new Date();
  // ✅ بداية الساعة الجاية (لو 10:14 → 11:00)
  const nextHourStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    now.getHours() + 1,
    0,
    0,
    0,
  );

  return times.filter((time) => {
    const [hours, minutes] = time.split(":").map(Number);
    const timeDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hours,
      minutes,
      0,
      0,
    );
    return timeDate >= nextHourStart;
  });
};
