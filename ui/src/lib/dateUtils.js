const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Format a timestamp to "14 Dec, 2025, 3:45 PM" format
 * Assumes input is UTC timestamp
 */
export function formatDateTime(timestamp) {
  const date = new Date(timestamp);
  const day = date.getUTCDate();
  const month = MONTHS[date.getUTCMonth()];
  const year = date.getUTCFullYear();
  
  let hours = date.getUTCHours();
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 should be 12
  
  return `${day} ${month}, ${year}, ${hours}:${minutes} ${ampm}`;
}

/**
 * Format a timestamp to just the date "14 Dec, 2025"
 * Assumes input is UTC timestamp
 */
export function formatDate(timestamp) {
  const date = new Date(timestamp);
  const day = date.getUTCDate();
  const month = MONTHS[date.getUTCMonth()];
  const year = date.getUTCFullYear();
  
  return `${day} ${month}, ${year}`;
}
