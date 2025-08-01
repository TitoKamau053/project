// Enhanced sanitizer and safeRender utilities for React/TSX with mining operations support

/**
 * Recursively sanitizes API data to ensure all values are primitives or arrays/objects of primitives.
 * Enhanced to handle mining operations data structures properly.
 */
export function sanitize<T>(data: T): T {
  if (data === null || data === undefined) return data;
  
  // Handle primitive types
  if (typeof data === 'string' || typeof data === 'number' || typeof data === 'boolean') {
    return data;
  }
  
  // Handle arrays
  if (Array.isArray(data)) {
    // For arrays, sanitize each item
    return data.map(item => sanitize(item)) as any;
  }
  
  // Handle objects
  if (typeof data === 'object') {
    // Handle Date objects
    if (data instanceof Date) {
      return data.toISOString() as any;
    }
    
    // Handle custom objects with toString method
    if (typeof (data as any).toString === 'function' && (data as any).toString() !== '[object Object]') {
      return (data as any).toString();
    }
    
    // Sanitize object properties
    const sanitized: any = {};
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const value = (data as any)[key];
        
        if (value === null || value === undefined) {
          sanitized[key] = value;
        } else if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
          sanitized[key] = value;
        } else if (value instanceof Date) {
          sanitized[key] = value.toISOString();
        } else if (Array.isArray(value)) {
          sanitized[key] = sanitize(value);
        } else if (typeof value === 'object') {
          // For nested objects, recursively sanitize
          sanitized[key] = sanitize(value);
        } else {
          // Fallback: convert to string
          sanitized[key] = String(value);
        }
      }
    }
    return sanitized;
  }
  
  // Fallback: stringify any other type
  return String(data) as any;
}

/**
 * Safely renders a value in JSX. Enhanced for mining operations data.
 */
export function safeRender(val: unknown): string {
  if (val === null || val === undefined) return '';
  
  if (typeof val === 'string') {
    // Handle stringified objects that might be passed
    if (val.startsWith('{') || val.startsWith('[')) {
      try {
        const parsed = JSON.parse(val);
        return safeRender(parsed);
      } catch {
        return val;
      }
    }
    return val;
  }
  
  if (typeof val === 'number') {
    // Handle large numbers and format appropriately
    if (val > 999999) {
      return (val / 1000000).toFixed(1) + 'M';
    } else if (val > 999) {
      return (val / 1000).toFixed(1) + 'K';
    }
    return val.toString();
  }
  
  if (typeof val === 'boolean') {
    return val ? 'Yes' : 'No';
  }
  
  if (Array.isArray(val)) {
    // For arrays, join primitive values or indicate object count
    if (val.length === 0) return 'None';
    if (val.every(item => typeof item === 'string' || typeof item === 'number')) {
      return val.slice(0, 3).join(', ') + (val.length > 3 ? '...' : '');
    }
    return `${val.length} items`;
  }
  
  if (typeof val === 'object') {
    // Handle common object patterns in mining operations
    if ('amount' in val && 'currency' in val) {
      return `${(val as any).currency} ${((val as any).amount || 0).toLocaleString()}`;
    }
    
    if ('earning_amount' in val && 'earning_datetime' in val) {
      return `KES ${((val as any).earning_amount || 0).toLocaleString()} on ${new Date((val as any).earning_datetime).toLocaleDateString()}`;
    }
    
    if ('status' in val && 'name' in val) {
      return `${(val as any).name} (${(val as any).status})`;
    }
    
    // For generic objects, try to extract meaningful info
    const keys = Object.keys(val);
    if (keys.includes('name')) return (val as any).name;
    if (keys.includes('title')) return (val as any).title;
    if (keys.includes('id')) return `ID: ${(val as any).id}`;
    
    // Fallback: indicate it's an object
    return `Object (${keys.length} properties)`;
  }
  
  return String(val);
}

/**
 * Format currency values consistently
 */
export function formatCurrency(amount: number | string | null | undefined, currency = 'KES'): string {
  if (amount === null || amount === undefined) return `${currency} 0.00`;
  
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(numAmount)) return `${currency} 0.00`;
  
  return `${currency} ${numAmount.toLocaleString(undefined, { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  })}`;
}

/**
 * Format time remaining for mining operations
 */
export function formatTimeRemaining(endTime: string | Date): string {
  const now = new Date();
  const end = new Date(endTime);
  const diff = end.getTime() - now.getTime();
  
  if (diff <= 0) return 'Completed';
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}

/**
 * Format progress percentage
 */
export function formatProgress(current: number, total: number): string {
  if (total === 0) return '0%';
  const percentage = (current / total) * 100;
  return `${Math.min(100, Math.max(0, percentage)).toFixed(1)}%`;
}

/**
 * Format earning interval display
 */
export function formatEarningInterval(interval: string | undefined): string {
  if (!interval) return 'Unknown';
  
  switch (interval.toLowerCase()) {
    case 'hourly':
      return 'Every Hour';
    case 'daily':
      return 'Every Day';
    case 'weekly':
      return 'Every Week';
    case 'monthly':
      return 'Every Month';
    default:
      return interval.charAt(0).toUpperCase() + interval.slice(1);
  }
}

/**
 * Format mining engine status
 */
export function formatMiningStatus(status: string | undefined): {
  text: string;
  color: string;
  bgColor: string;
} {
  if (!status) {
    return {
      text: 'Unknown',
      color: 'text-slate-400',
      bgColor: 'bg-slate-500/20'
    };
  }
  
  switch (status.toLowerCase()) {
    case 'active':
      return {
        text: 'Active',
        color: 'text-green-400',
        bgColor: 'bg-green-500/20'
      };
    case 'completed':
      return {
        text: 'Completed',
        color: 'text-blue-400',
        bgColor: 'bg-blue-500/20'
      };
    case 'paused':
      return {
        text: 'Paused',
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-500/20'
      };
    case 'cancelled':
      return {
        text: 'Cancelled',
        color: 'text-red-400',
        bgColor: 'bg-red-500/20'
      };
    case 'pending':
      return {
        text: 'Pending',
        color: 'text-orange-400',
        bgColor: 'bg-orange-500/20'
      };
    default:
      return {
        text: status.charAt(0).toUpperCase() + status.slice(1),
        color: 'text-slate-400',
        bgColor: 'bg-slate-500/20'
      };
  }
}

/**
 * Calculate ROI percentage
 */
export function calculateROI(invested: number, earned: number): string {
  if (invested === 0) return '0%';
  const roi = ((earned / invested) - 1) * 100;
  const sign = roi >= 0 ? '+' : '';
  return `${sign}${roi.toFixed(1)}%`;
}

/**
 * Format date for display
 */
export function formatDate(date: string | Date | null | undefined, options?: {
  includeTime?: boolean;
  short?: boolean;
}): string {
  if (!date) return 'Not set';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return 'Invalid date';
  
  const { includeTime = false, short = false } = options || {};
  
  if (short) {
    return dateObj.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: '2-digit'
    });
  }
  
  if (includeTime) {
    return dateObj.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  return dateObj.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Safely get nested object property
 */
export function safeGet(obj: any, path: string, defaultValue: any = null): any {
  const keys = path.split('.');
  let result = obj;
  
  for (const key of keys) {
    if (result === null || result === undefined || !(key in result)) {
      return defaultValue;
    }
    result = result[key];
  }
  
  return result;
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string | null | undefined, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

/**
 * Format currency with proper precision
 */
export function formatCurrencyPrecise(amount: number | string | null | undefined, currency = 'KES', decimals = 2): string {
  if (amount === null || amount === undefined) return `${currency} 0.${'0'.repeat(decimals)}`;
  
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(numAmount)) return `${currency} 0.${'0'.repeat(decimals)}`;
  
  return `${currency} ${numAmount.toLocaleString(undefined, { 
    minimumFractionDigits: decimals, 
    maximumFractionDigits: decimals 
  })}`;
}

/**
 * Safe number parsing with validation
 */
export function safeNumber(value: any, defaultValue = 0): number {
  if (value === null || value === undefined || value === '') return defaultValue;
  
  // Handle string numbers with multiple decimal points (like your concatenated values)
  if (typeof value === 'string') {
    // Remove any non-numeric characters except first decimal point
    const cleaned = value.replace(/[^\d.-]/g, '').replace(/(?<=\..*)\..*/, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? defaultValue : parsed;
  }
  
  const parsed = parseFloat(value);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Calculate ROI percentage safely
 */
export function calculateROISafe(invested: number | string, earned: number | string): string {
  const investedNum = safeNumber(invested);
  const earnedNum = safeNumber(earned);
  
  if (investedNum === 0) return '0.0%';
  
  const roi = ((earnedNum / investedNum) - 1) * 100;
  const sign = roi >= 0 ? '+' : '';
  return `${sign}${roi.toFixed(1)}%`;
}