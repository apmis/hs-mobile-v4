// HELPER: Format Time
export const formatMessageTime = (dateInput: any) => {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  const hours = date.getHours();
  const mins = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;
  const formattedMins = mins < 10 ? `0${mins}` : mins;
  return `${formattedHours < 10 ? '0' : ''}${formattedHours}:${formattedMins} ${ampm}`;
};

export const getMessageDateLabel = (dateInput: any) => {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return 'TODAY'; // Fallback for invalid dates

  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === now.toDateString()) {
    return 'TODAY';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'YESTERDAY';
  } else {
    const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const isSameYear = date.getFullYear() === now.getFullYear();
    const month = MONTHS[date.getMonth()];
    const day = date.getDate();

    if (isSameYear) {
      return `${month} ${day}`;
    } else {
      return `${month} ${day}, ${date.getFullYear()}`;
    }
  }
};

// HELPER: Map API Message to UI Bubble format
export const mapApiMessageToUI = (m: any, user: any) => {
  const isMe = m.createdbyId === user?._id;
  const sender = isMe ? 'You' : (m.createdby?.firstname || m.createdby?.name || 'Unknown');
  const avatar = m.createdby?.imageurl;

  return {
    id: m._id || m.id || Date.now().toString(),
    isMe,
    sender,
    avatar,
    time: formatMessageTime(m.createdAt || m.time || new Date()),
    text: m.message,
    status: m.status,
    file: m.file,
    attachmentName: m.attachmentName,
    type: m.type,
    title: m.title,
    desc: m.desc,
    rawDate: m.createdAt || m.time || new Date()
  };
};

// HELPER: Get Acronym for Organization
export const getAcronym = (name?: string, maxLength = 25) => {
  if (!name) return '';
  const trimmed = name.trim();

  if (trimmed.length <= maxLength) {
    return trimmed;
  }

  const words = trimmed.split(/\s+/);
  if (words.length === 1) {
    return words[0].substring(0, 3).toUpperCase();
  }

  return words.map(w => w[0]).join('').toUpperCase();
};
