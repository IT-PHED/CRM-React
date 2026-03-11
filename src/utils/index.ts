export const formatCurrency = (amount: number, currency: string = '₦'): string => {
  return `${currency}${amount.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const formatDate = (dateString: string, showTime: boolean = true): string => {
  if (!dateString) return '—';
  
  // Handle format: DD-MM-YYYY HH:mm:ss
  const [datePart, timePart] = dateString.split(' ');
  if (!datePart) return dateString;
  
  const [day, month, year] = datePart.split('-');
  const date = new Date(`${year}-${month}-${day}`);
  
  if (isNaN(date.getTime())) return dateString;
  
  const formattedDate = date.toLocaleDateString("en-GB", {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  
  return showTime && timePart ? `${formattedDate} ${timePart}` : formattedDate;
};

export const isEmpty = (value: string | number | null | undefined): boolean => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '' || value === ' ';
  return false;
};

export const formatUTCString = (dateString: string): string => {
  const date = new Date(dateString);

  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
}

export const formatDateTime2 = (input: string): string => {
  const [datePart, timePart] = input.split(" ");
  const [day, month, year] = datePart.split("-");

  const date = new Date(`${year}-${month}-${day}T${timePart}`);

  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
}

export const formatCurrencyString = (value: number | null): string => {
  if (value === null || value === undefined) return "0.00";
  return Math.abs(value).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

/** Convert nullable value to string, empty string if null/undefined */
export const nullToString = (value: unknown): string => {
  if (value === null || value === undefined) return "";
  return String(value);
};